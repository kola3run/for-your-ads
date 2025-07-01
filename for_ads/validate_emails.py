import asyncio
import aiosmtplib
import dns.resolver
import sqlite3
import logging
import random

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('email_check.log', encoding='utf-8', mode='a', delay=False),
        logging.StreamHandler()
    ],
    force=True
)
logger = logging.getLogger()
for handler in logger.handlers:
    handler.flush = lambda: handler.stream.flush()

async def check_email(email, semaphore):
    async with semaphore:
        try:
            domain = email.split('@')[1]
            mx_records = dns.resolver.resolve(domain, 'MX')
            mx_host = mx_records[0].exchange.to_text()
            async with aiosmtplib.SMTP(hostname=mx_host, timeout=10) as server:
                await server.helo()
                await server.mail('test@yourdomain.com')
                code, _ = await server.rcpt(email)
                return code == 250
        except Exception as e:
            logging.warning(f"Ошибка проверки {email}: {e}")
            return False
        finally:
            await asyncio.sleep(random.uniform(1, 3))  # Ограничение скорости

async def main():
    conn = sqlite3.connect('real_estate_agents.db')
    c = conn.cursor()
    c.execute('SELECT id, email FROM agents WHERE email IS NOT NULL')
    emails = c.fetchall()
    conn.close()
    logging.info(f"Найдено {len(emails)} email для проверки")

    semaphore = asyncio.Semaphore(10)  # Ограничение на 10 одновременных проверок
    tasks = [check_email(email, semaphore) for _, email in emails]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    conn = sqlite3.connect('real_estate_agents.db')
    c = conn.cursor()
    for (id, email), result in zip(emails, results):
        if isinstance(result, Exception):
            logging.warning(f"Ошибка проверки {email}: {result}")
            c.execute('UPDATE agents SET email = NULL WHERE id = ?', (id,))
            logging.info(f"Невалидный email: {email}")
        elif result:
            logging.info(f"Валидный email: {email}")
        else:
            c.execute('UPDATE agents SET email = NULL WHERE id = ?', (id,))
            logging.info(f"Невалидный email: {email}")
    conn.commit()
    conn.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        logging.error(f"Критическая ошибка: {e}")