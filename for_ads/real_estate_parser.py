import asyncio
import aiohttp
from bs4 import BeautifulSoup
import re
import sqlite3
import random
import phonenumbers
from phonenumbers import PhoneNumberFormat
from fake_useragent import UserAgent
from urllib.parse import urljoin
import logging
from logging.handlers import TimedRotatingFileHandler
import os
try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None
    logging.warning("playwright не установлен, JavaScript-страницы могут не парситься")

# Настройка логирования
log_file = 'parser.log'
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        TimedRotatingFileHandler(log_file, when='midnight', interval=1, backupCount=5, encoding='utf-8'),
        logging.StreamHandler()
    ],
    force=True
)
logger = logging.getLogger()
for handler in logger.handlers:
    handler.flush = lambda: handler.stream.flush()

# Настройки
DATABASE = "real_estate_agents.db"
PROCESSED_URLS_FILE = "processed_urls.txt"
DEFAULT_COUNTRY = "France"
MAX_CONCURRENT = 10
SCRAPINGBEE_API_KEY = "YOUR_SCRAPINGBEE_API_KEY"  # Замените на ваш ключ
DOMAIN_COUNTRIES = {
    ".fr": "France",
    ".de": "Germany",
    ".it": "Italy",
    ".es": "Spain",
    ".com": "United States",
    ".co.uk": "United Kingdom",
}
STARTING_CATALOGS = [
    "https://www.fnaim.fr/en/agencies",
    "https://www.seloger.com/annonces/agences",
    "https://www.logic-immo.com/agences-immobilieres",
    "https://www.century21.fr",
    "https://www.orpi.com",
    "https://www.bienici.com/agences-immobilieres",
    "https://www.green-acres.fr/en/agencies",
    "https://www.remax.com/en-us/agents",
    "https://www.coldwellbanker.com/agents",
    "https://www.kw.com/agents",
]

# Инициализация User-Agent
ua = UserAgent()

# Множества для хранения обработанных данных
processed_emails = set()
processed_phones = set()
processed_urls = set()

# Инициализация базы данных SQLite
def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS agents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            country TEXT,
            name TEXT,
            website TEXT,
            email TEXT,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('CREATE INDEX IF NOT EXISTS idx_email ON agents (email)')
    conn.commit()
    conn.close()
    logging.info("База данных инициализирована")

# Функция проверки существования файлов
def ensure_files_exist():
    if not os.path.exists(PROCESSED_URLS_FILE):
        with open(PROCESSED_URLS_FILE, 'w', encoding='utf-8') as f:
            f.write("")
        logging.info(f"Создан файл {PROCESSED_URLS_FILE}")
    try:
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write("")
        logging.info(f"Файл {log_file} доступен для записи")
    except Exception as e:
        logging.error(f"Ошибка доступа к {log_file}: {e}")

# Функция загрузки обработанных URL
def load_processed_urls():
    try:
        with open(PROCESSED_URLS_FILE, 'r', encoding='utf-8') as f:
            urls = set(line.strip() for line in f if line.strip())
        logging.info(f"Загружено {len(urls)} обработанных URL")
        return urls
    except Exception as e:
        logging.error(f"Ошибка загрузки {PROCESSED_URLS_FILE}: {e}")
        return set()

# Функция сохранения обработанных URL
def save_processed_url(url):
    try:
        with open(PROCESSED_URLS_FILE, 'a', encoding='utf-8') as f:
            f.write(url + '\n')
        logging.info(f"Сохранён URL: {url}")
    except Exception as e:
        logging.error(f"Ошибка сохранения URL {url}: {e}")

# Функция проверки валидности телефона
def check_phone(phone, country_code="+33"):
    try:
        parsed_number = phonenumbers.parse(phone, country_code[1:])
        if phonenumbers.is_valid_number(parsed_number):
            return phonenumbers.format_number(parsed_number, PhoneNumberFormat.E164)
        return None
    except Exception:
        return None

# Асинхронная функция проверки кликабельности ссылки
async def check_url(url, session):
    try:
        async with session.head(url, timeout=5, allow_redirects=True) as response:
            return response.status == 200
    except Exception:
        return False

# Функция извлечения email
def extract_emails(text):
    emails = set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text))
    valid_emails = []
    for email in emails:
        if email not in processed_emails:
            valid_emails.append(email)
            processed_emails.add(email)
    logging.info(f"Извлечено {len(valid_emails)} новых email")
    return valid_emails

# Функция извлечения телефонов
def extract_phones(text, country_code="+33"):
    phones = set(re.findall(r"\+?\d[\d\s\-().]{7,}", text))
    valid_phones = []
    for phone in phones:
        formatted_phone = check_phone(phone, country_code)
        if formatted_phone and formatted_phone not in processed_phones:
            valid_phones.append(formatted_phone)
            processed_phones.add(formatted_phone)
    logging.info(f"Извлечено {len(valid_phones)} новых телефонов")
    return valid_phones

# Функция извлечения названия агентства
def extract_agency_name(soup):
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    h1 = soup.find("h1")
    if h1 and h1.text.strip():
        return h1.text.strip()
    return "No Name Found"

# Функция получения страны по URL
def get_country_from_url(url):
    for ext, country in DOMAIN_COUNTRIES.items():
        if ext in url:
            return country
    return DEFAULT_COUNTRY

# Асинхронная функция получения страницы через ScrapingBee
async def scrape_url(url, session):
    try:
        scrapingbee_url = f"https://api.scrapingbee.com/?api_key={SCRAPINGBEE_API_KEY}&url={quote(url)}&premium_proxy=true"
        async with session.get(scrapingbee_url, headers={'User-Agent': ua.random}, timeout=15) as response:
            return await response.text()
    except Exception as e:
        logging.error(f"Ошибка ScrapingBee для {url}: {e}")
        return None

# Асинхронная функция парсинга страницы контактов
async def find_contact_page(url, session):
    try:
        text = await scrape_url(url, session)
        if not text:
            return None
        soup = BeautifulSoup(text, 'html.parser')
        for a in soup.find_all('a', href=True):
            href = a['href'].lower()
            if any(keyword in href for keyword in ['contact', 'kontakt', 'about', 'nous', 'uber-uns', 'impressum']):
                contact_url = urljoin(url, href)
                if await check_url(contact_url, session):
                    contact_text = await scrape_url(contact_url, session)
                    if contact_text:
                        logging.info(f"Найдена страница контактов: {contact_url}")
                        return contact_text
        return None
    except Exception as e:
        logging.error(f"Ошибка поиска страницы контактов для {url}: {e}")
        return None

# Асинхронная функция парсинга подстраниц каталога
async def scrape_catalog_subpages(url, session):
    sub_urls = set()
    try:
        text = await scrape_url(url, session)
        if not text:
            return sub_urls
        soup = BeautifulSoup(text, 'html.parser')
        for a in soup.find_all('a', href=True):
            href = urljoin(url, a['href'])
            if any(keyword in href.lower() for keyword in ['agence', 'agency', 'makler', 'inmobiliaria', 'realtor', 'agent', 'estate']):
                sub_urls.add(href)
        logging.info(f"Найдено {len(sub_urls)} подстраниц для {url}")
        return sub_urls
    except Exception as e:
        logging.error(f"Ошибка парсинга каталога {url}: {e}")
        return sub_urls

# Асинхронная функция генерации URL
async def generate_urls(session, max_urls=1000):
    global processed_urls
    processed_urls = load_processed_urls()
    urls = set()
    
    for catalog in STARTING_CATALOGS:
        if len(urls) >= max_urls:
            break
        sub_urls = await scrape_catalog_subpages(catalog, session)
        for url in sub_urls:
            if url not in processed_urls and url not in urls:
                urls.add(url)
                save_processed_url(url)
                processed_urls.add(url)
                logging.info(f"Добавлен URL: {url}")
        logging.info(f"Обработан каталог {catalog}, всего URL: {len(urls)}")

    logging.info(f"Итоговое количество ссылок: {len(urls)}")
    return list(urls)

# Асинхронная функция парсинга страницы
async def parse_page(url, session):
    logging.info(f"Начало парсинга: {url}")
    for attempt in range(3):
        try:
            text = await scrape_url(url, session)
            if not text:
                logging.warning(f"Не удалось получить содержимое {url}")
                return None

            soup = BeautifulSoup(text, 'html.parser')
            name = extract_agency_name(soup)
            emails = extract_emails(text)
            country = get_country_from_url(url)
            phones = extract_phones(text, "+33" if country == "France" else "+49")
            website = url if await check_url(url, session) else "Invalid URL"

            if not emails:
                contact_content = await find_contact_page(url, session)
                if contact_content:
                    soup = BeautifulSoup(contact_content, 'html.parser')
                    emails = extract_emails(contact_content)
                    phones = extract_phones(contact_content, "+33" if country == "France" else "+49")

            if not emails:
                logging.info(f"Пропущен {url}: нет валидных email")
                return None

            logging.info(f"Найдены email для {url}: {emails}")
            return {
                "country": country,
                "name": name,
                "website": website,
                "email": emails[0],
                "phone": phones[0] if phones else None
            }
        except Exception as e:
            logging.error(f"Попытка {attempt+1} не удалась для {url}: {e}")
            await asyncio.sleep(random.uniform(3, 7))
    logging.error(f"Не удалось спарсить {url} после 3 попыток")
    return None

# Функция сохранения данных в SQLite
def save_to_db(data_list):
    if not data_list:
        logging.info("Нет данных для сохранения")
        return
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.executemany('''
            INSERT INTO agents (country, name, website, email, phone)
            VALUES (?, ?, ?, ?, ?)
        ''', [(d['country'], d['name'], d['website'], d['email'], d['phone']) for d in data_list])
        conn.commit()
        conn.close()
        for data in data_list:
            logging.info(f"Сохранена запись: {data['name']} ({data['country']})")
    except Exception as e:
        logging.error(f"Ошибка сохранения в базу данных: {e}")

# Основная асинхронная функция
async def main():
    init_db()
    ensure_files_exist()
    
    global processed_emails, processed_phones
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT email, phone FROM agents')
    for row in c.fetchall():
        if row[0]:
            processed_emails.add(row[0])
        if row[1]:
            processed_phones.add(row[1])
    conn.close()
    logging.info(f"Загружено {len(processed_emails)} email и {len(processed_phones)} телефонов из базы")

    async with aiohttp.ClientSession() as session:
        urls = []
        while True:
            try:
                if not urls:
                    logging.info("Обновление списка URL...")
                    urls = await generate_urls(session, max_urls=1000)
                    logging.info(f"Сгенерировано {len(urls)} новых URL: {urls[:5]}...")

                if not urls:
                    logging.warning("Нет доступных URL, завершение...")
                    break

                logging.info(f"Осталось обработать {len(urls)} URL")
                tasks = []
                for url in urls[:MAX_CONCURRENT]:
                    tasks.append(parse_page(url, session))
                    urls.remove(url)
                logging.info(f"Запущено {len(tasks)} задач парсинга")

                results = await asyncio.gather(*tasks, return_exceptions=True)
                valid_results = []
                for i, result in enumerate(results):
                    if isinstance(result, Exception):
                        logging.error(f"Ошибка в задаче {i+1}: {result}")
                    elif isinstance(result, dict):
                        valid_results.append(result)

                if valid_results:
                    save_to_db(valid_results)

                conn = sqlite3.connect(DATABASE)
                c = conn.cursor()
                c.execute('SELECT COUNT(*) FROM agents')
                total_records = c.fetchone()[0]
                conn.close()
                logging.info(f"Всего сохранено записей: {total_records}")

                await asyncio.sleep(random.uniform(5, 10))
            except Exception as e:
                logging.error(f"Ошибка в главном цикле: {e}")
                await asyncio.sleep(10)

# Запуск
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        logging.error(f"Критическая ошибка при запуске: {e}")