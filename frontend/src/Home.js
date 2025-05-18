import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiPlusCircle, FiArrowUp, FiUser } from 'react-icons/fi';
import ForuadsImg from './assets/foruads.jpg';
import Logo from './assets/logo3.svg';
import Filter from './Filter';
import ParisSvg from './assets/Paris.svg';
import BerlinSvg from './assets/Berlin.svg';
import RomeSvg from './assets/Rome.svg';
import AmsterdamSvg from './assets/Amsterdam.svg';
import RigaSvg from './assets/Riga.svg';

function Home({ openLoginModal, openRegisterModal, isAuthenticated }) {
  const { t, i18n } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filterParams, setFilterParams] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ];

  const cities = [
    { name: 'Paris', country: 'France', properties: 2500, image: ParisSvg },
    { name: 'Berlin', country: 'Germany', properties: 1800, image: BerlinSvg },
    { name: 'Rome', country: 'Italy', properties: 1500, image: RomeSvg },
    { name: 'Amsterdam', country: 'Netherlands', properties: 1200, image: AmsterdamSvg },
    { name: 'Riga', country: 'Latvia', properties: 800, image: RigaSvg },
  ];

  const listingsBuy = [
    { id: 1, title: 'Modern Apartment', price: '€250,000', priceValue: 250000, location: `${t('Berlin')}, ${t('Germany')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 2, title: 'Spacious Flat', price: '€300,000', priceValue: 300000, location: `${t('Paris')}, ${t('France')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 3, title: 'Luxury Condo', price: '€450,000', priceValue: 450000, location: `${t('Rome')}, ${t('Italy')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 4, title: 'Cozy Studio', price: '€180,000', priceValue: 180000, location: `${t('Amsterdam')}, ${t('Netherlands')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 5, title: 'Downtown Penthouse', price: '€500,000', priceValue: 500000, location: `${t('Madrid')}, ${t('Spain')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 6, title: 'Family House', price: '€320,000', priceValue: 320000, location: `${t('Vienna')}, ${t('Austria')}`, image: ForuadsImg, type: 'House' },
  ];

  const listingsRentLong = [
    { id: 7, title: 'Cozy House', price: '€1,200/month', priceValue: 1200, location: `${t('Paris')}, ${t('France')}`, image: ForuadsImg, type: 'House' },
    { id: 8, title: 'Family Home', price: '€1,500/month', priceValue: 1500, location: `${t('Berlin')}, ${t('Germany')}`, image: ForuadsImg, type: 'House' },
    { id: 9, title: 'Modern Loft', price: '€1,800/month', priceValue: 1800, location: `${t('Rome')}, ${t('Italy')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 10, title: 'Apartment with View', price: '€1,000/month', priceValue: 1000, location: `${t('Riga')}, ${t('Latvia')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 11, title: 'Spacious Flat', price: '€1,300/month', priceValue: 1300, location: `${t('Lisbon')}, ${t('Portugal')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 12, title: 'Quiet Residence', price: '€1,100/month', priceValue: 1100, location: `${t('Stockholm')}, ${t('Sweden')}`, image: ForuadsImg, type: 'House' },
  ];

  const listingsRentShort = [
    { id: 13, title: 'Luxury Villa', price: '€500/night', priceValue: 500, location: `${t('Lisbon')}, ${t('Portugal')}`, image: ForuadsImg, type: 'House' },
    { id: 14, title: 'Beach House', price: '€300/night', priceValue: 300, location: `${t('Barcelona')}, ${t('Spain')}`, image: ForuadsImg, type: 'House' },
    { id: 15, title: 'City Retreat', price: '€400/night', priceValue: 400, location: `${t('Vienna')}, ${t('Austria')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 16, title: 'Mountain Cabin', price: '€350/night', priceValue: 350, location: `${t('Zurich')}, Switzerland`, image: ForuadsImg, type: 'House' },
    { id: 17, title: 'Seaside Apartment', price: '€280/night', priceValue: 280, location: `${t('Nice')}, ${t('France')}`, image: ForuadsImg, type: 'Apartment' },
    { id: 18, title: 'Urban Getaway', price: '€450/night', priceValue: 450, location: `${t('Amsterdam')}, ${t('Netherlands')}`, image: ForuadsImg, type: 'Apartment' },
  ];

  const [bannerConfig, setBannerConfig] = useState({
    buy: { show: true, position: 'right', content: 'Banner Placeholder (Buy)' },
    rentLong: { show: true, position: 'left', content: 'Banner Placeholder (Rent Long)' },
    rentShort: { show: true, position: 'right', content: 'Banner Placeholder (Rent Short)' },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const changeCurrency = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  const filterListings = (listings, category) => {
    if (!filterParams && !userCountry) return listings;

    return listings.filter(listing => {
      const { country, city, dealType, rentType, propertyType, priceMax } = filterParams || {};

      if (dealType === 'buy' && category !== 'buy') return false;
      if (dealType === 'rent' && rentType === 'rent_long' && category !== 'rent_long') return false;
      if (dealType === 'rent' && rentType === 'rent_short' && category !== 'rent_short') return false;

      const [listingCity, listingCountry] = listing.location.split(', ').map(item => t(item, { lng: 'en' }));
      if (country && listingCountry !== country) return false;
      if (city && listingCity !== city) return false;
      if (userCountry && listingCountry !== userCountry) return false;

      if (propertyType && listing.type !== propertyType) return false;
      if (priceMax && listing.priceValue > priceMax) return false;

      return true;
    });
  };

  const filteredListingsBuy = filterListings(listingsBuy, 'buy').slice(0, 6);
  const filteredListingsRentLong = filterListings(listingsRentLong, 'rent_long').slice(0, 6);
  const filteredListingsRentShort = filterListings(listingsRentShort, 'rent_short').slice(0, 6);

  const handleFilter = (params) => {
    setFilterParams(params);
    if (params.country) {
      setUserCountry(params.country);
    }
  };

  const handleCityClick = (cityName, countryName) => {
    navigate(`/listings?city=${cityName}&country=${countryName}`);
  };

  const handleSearchRedirect = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/listings?${query}`);
  };

  const handleLoginClick = () => {
    if (openLoginModal) {
      openLoginModal();
    } else {
      console.error('openLoginModal is not provided');
    }
  };

  const handleRegisterClick = () => {
    if (openRegisterModal) {
      openRegisterModal();
    } else {
      console.error('openRegisterModal is not provided');
    }
  };

  return (
    <div>
      {/* Хедер */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/">
              <img src={Logo} alt="4 Your Ads" className="logo" />
            </Link>
            <div className="header-title">
              <h1>FOR YOUR ADS</h1>
            </div>
          </div>
          <div className="header-actions">
            <div className="dropdown">
              <button className="dropdown-btn">
                {languages.find(l => l.code === i18n.language)?.flag || '🌐'} {languages.find(l => l.code === i18n.language)?.name || 'Language'}
              </button>
              <div className="dropdown-content">
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="dropdown-item"
                  >
                    {lang.flag} {lang.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="dropdown">
              <button className="dropdown-btn">
                {currencies.find(c => c.code === selectedCurrency)?.symbol || '€'} {currencies.find(c => c.code === selectedCurrency)?.code || 'Currency'}
              </button>
              <div className="dropdown-content">
                {currencies.map(currency => (
                  <div
                    key={currency.code}
                    onClick={() => changeCurrency(currency.code)}
                    className="dropdown-item"
                  >
                    {currency.symbol} {currency.code}
                  </div>
                ))}
              </div>
            </div>
            <button className="nav-btn primary" onClick={handleRegisterClick}>
              <FiPlusCircle className="nav-btn-icon" />
              {t('register')}
            </button>
            {isAuthenticated ? (
              <div className="user-avatar">
                <FiUser className="avatar-icon" />
              </div>
            ) : (
              <button className="nav-btn" onClick={handleLoginClick}>
                <FiLogIn className="nav-btn-icon" />
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Секция оффера */}
      <section className="offer">
        <div className="offer-container">
          <h1>{t('offer_title_europe')}</h1>
          <div className="filter-section">
            <Filter
              selectedCurrency={selectedCurrency}
              currencies={currencies}
              onFilter={handleFilter}
              onSearchRedirect={handleSearchRedirect}
            />
          </div>
        </div>
      </section>

      {/* Популярные направления */}
      <section className="popular-cities">
        <div className="popular-cities-container">
          <div className="cities-scroll">
            {cities.map((city) => (
              <div
                key={city.name}
                className="city-card"
                onClick={() => handleCityClick(city.name, city.country)}
                style={{ cursor: 'pointer' }}
              >
                <img src={city.image} alt={t(city.name)} className="city-image" />
                <div>
                  <h3>{t(city.name)}</h3>
                  <p>{city.properties} {t('properties')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Рекомендованные объявления */}
      <section className="best-offers">
        {/* BUY: баннер справа */}
        <div className="category-with-banner">
          <h2 className="section-title">{t('buy')}</h2>
          {bannerConfig.buy.show ? (
            <div className="banner-and-content">
              {bannerConfig.buy.position === 'left' ? (
                <>
                  <div className="banner-section">
                    <div className="banner-left">{bannerConfig.buy.content}</div>
                  </div>
                  <div className="category-content">
                    {filteredListingsBuy.length > 0 ? (
                      <div className="offers-grid">
                        {filteredListingsBuy.map((listing) => (
                          <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                            <img src={listing.image} alt={listing.title} />
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="price">{listing.price}</p>
                              <p>{listing.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>{t('no_results')}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="category-content">
                    {filteredListingsBuy.length > 0 ? (
                      <div className="offers-grid">
                        {filteredListingsBuy.map((listing) => (
                          <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                            <img src={listing.image} alt={listing.title} />
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="price">{listing.price}</p>
                              <p>{listing.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>{t('no_results')}</p>
                    )}
                  </div>
                  <div className="banner-section">
                    <div className="banner-right">{bannerConfig.buy.content}</div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="category-content">
              {filteredListingsBuy.length > 0 ? (
                <div className="offers-grid">
                  {filteredListingsBuy.map((listing) => (
                    <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                      <img src={listing.image} alt={listing.title} />
                      <div>
                        <h3>{listing.title}</h3>
                        <p className="price">{listing.price}</p>
                        <p>{listing.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>{t('no_results')}</p>
              )}
            </div>
          )}
        </div>

        {/* RENT LONG: баннер слева */}
        <div className="category-with-banner">
          <h2 className="section-title">{t('rent_long')}</h2>
          {bannerConfig.rentLong.show ? (
            <div className="banner-and-content">
              {bannerConfig.rentLong.position === 'left' ? (
                <>
                  <div className="banner-section">
                    <div className="banner-left">{bannerConfig.rentLong.content}</div>
                  </div>
                  <div className="category-content">
                    {filteredListingsRentLong.length > 0 ? (
                      <div className="offers-grid">
                        {filteredListingsRentLong.map((listing) => (
                          <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                            <img src={listing.image} alt={listing.title} />
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="price">{listing.price}</p>
                              <p>{listing.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>{t('no_results')}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="category-content">
                    {filteredListingsRentLong.length > 0 ? (
                      <div className="offers-grid">
                        {filteredListingsRentLong.map((listing) => (
                          <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                            <img src={listing.image} alt={listing.title} />
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="price">{listing.price}</p>
                              <p>{listing.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>{t('no_results')}</p>
                    )}
                  </div>
                  <div className="banner-section">
                    <div className="banner-right">{bannerConfig.rentLong.content}</div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="category-content">
              {filteredListingsRentLong.length > 0 ? (
                <div className="offers-grid">
                  {filteredListingsRentLong.map((listing) => (
                    <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                      <img src={listing.image} alt={listing.title} />
                      <div>
                        <h3>{listing.title}</h3>
                        <p className="price">{listing.price}</p>
                        <p>{listing.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>{t('no_results')}</p>
              )}
            </div>
          )}
        </div>

        {/* RENT SHORT: баннер справа */}
        <div className="category-with-banner">
          <h2 className="section-title">{t('rent_short')}</h2>
          {bannerConfig.rentShort.show ? (
            <div className="banner-and-content">
              {bannerConfig.rentShort.position === 'left' ? (
                <>
                  <div className="banner-section">
                    <div className="banner-left">{bannerConfig.rentShort.content}</div>
                  </div>
                  <div className="category-content">
                    {filteredListingsRentShort.length > 0 ? (
                      <div className="offers-grid">
                        {filteredListingsRentShort.map((listing) => (
                          <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                            <img src={listing.image} alt={listing.title} />
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="price">{listing.price}</p>
                              <p>{listing.location}</p>
                            </div>
                  </Link>
                        ))}
                      </div>
                    ) : (
                      <p>{t('no_results')}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="category-content">
                    {filteredListingsRentShort.length > 0 ? (
                      <div className="offers-grid">
                        {filteredListingsRentShort.map((listing) => (
                          <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                            <img src={listing.image} alt={listing.title} />
                            <div>
                              <h3>{listing.title}</h3>
                              <p className="price">{listing.price}</p>
                              <p>{listing.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p>{t('no_results')}</p>
                    )}
                  </div>
                  <div className="banner-section">
                    <div className="banner-right">{bannerConfig.rentShort.content}</div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="category-content">
              {filteredListingsRentShort.length > 0 ? (
                <div className="offers-grid">
                  {filteredListingsRentShort.map((listing) => (
                    <Link to={`/property/${listing.id}`} key={listing.id} className="offer-card">
                      <img src={listing.image} alt={listing.title} />
                      <div>
                        <h3>{listing.title}</h3>
                        <p className="price">{listing.price}</p>
                        <p>{listing.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>{t('no_results')}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* О сервисе */}
      <section className="about">
        <img src={ForuadsImg} alt="About" />
        <div className="about-text">
          <h2>{t('about_title')}</h2>
          <p>{t('about_text')}</p>
        </div>
      </section>

      {/* Подвал */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>{t('footer_about')}</h3>
            <p>{t('footer_about_text')}</p>
          </div>
          <div>
            <h3>{t('footer_support')}</h3>
            <p>{t('footer_support_email')}</p>
          </div>
          <div>
            <h3>{t('footer_contacts')}</h3>
            <p>{t('footer_phone')}</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <FiArrowUp />
        </button>
      )}
    </div>
  );
}

export default Home;