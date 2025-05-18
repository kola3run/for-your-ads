import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { FiLogIn, FiPlusCircle, FiUser, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Logo from './assets/logo3.svg';
import ForuadsImg from './assets/foruads.jpg';
import FilterListing from './FilterListing';
import './Listings.css';

function Listings({ openLoginModal, openRegisterModal, isAuthenticated }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [isFilterFixed, setIsFilterFixed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;

  const filterSectionRef = useRef(null);
  const headerRef = useRef(null);

  const allListings = useMemo(
    () => [
      {
        id: 1,
        title: 'Modern Apartment',
        price: '€250,000',
        priceValue: 250000,
        location: `${t('Berlin')}, ${t('Germany')}`,
        images: [ForuadsImg, ForuadsImg, ForuadsImg],
        type: 'Apartment',
        dealType: 'buy',
        description: 'A modern apartment in the heart of Berlin with stunning city views.',
        area: 75,
        floor: 3,
        rooms: 3,
        yearBuilt: 2018,
      },
      {
        id: 2,
        title: 'Cozy House',
        price: '€350,000',
        priceValue: 350000,
        location: `${t('Paris')}, ${t('France')}`,
        images: [ForuadsImg, ForuadsImg, ForuadsImg],
        type: 'House',
        dealType: 'buy',
        description: 'A cozy house in the suburbs of Paris, perfect for a family.',
        area: 120,
        floor: null,
        rooms: 4,
        yearBuilt: 2015,
      },
      {
        id: 3,
        title: 'City Apartment',
        price: '€1,500',
        priceValue: 1500,
        location: `${t('Madrid')}, ${t('Spain')}`,
        images: [ForuadsImg, ForuadsImg, ForuadsImg],
        type: 'Apartment',
        dealType: 'rent',
        rentType: 'rent_long',
        description: 'A stylish apartment in the center of Madrid, available for long-term rent.',
        area: 60,
        floor: 5,
        rooms: 2,
        yearBuilt: 2020,
      },
      {
        id: 4,
        title: 'Luxury Villa',
        price: '€500,000',
        priceValue: 500000,
        location: `${t('Barcelona')}, ${t('Spain')}`,
        images: [ForuadsImg, ForuadsImg, ForuadsImg],
        type: 'Villa',
        dealType: 'buy',
        description: 'A luxury villa with a sea view in Barcelona.',
        area: 200,
        floor: null,
        rooms: 5,
        yearBuilt: 2022,
      },
      {
        id: 5,
        title: 'Studio Apartment',
        price: '€800',
        priceValue: 800,
        location: `${t('Rome')}, ${t('Italy')}`,
        images: [ForuadsImg, ForuadsImg, ForuadsImg],
        type: 'Apartment',
        dealType: 'rent',
        rentType: 'rent_short',
        description: 'A cozy studio apartment in the center of Rome, available for short-term rent.',
        area: 40,
        floor: 2,
        rooms: 1,
        yearBuilt: 2019,
      },
      {
        id: 6,
        title: 'Country House',
        price: '€200,000',
        priceValue: 200000,
        location: `${t('Tuscany')}, ${t('Italy')}`,
        images: [ForuadsImg, ForuadsImg, ForuadsImg],
        type: 'House',
        dealType: 'buy',
        description: 'A charming country house in the heart of Tuscany.',
        area: 150,
        floor: null,
        rooms: 3,
        yearBuilt: 2010,
      },
    ],
    [t]
  );

  const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const filterSection = filterSectionRef.current;
      const header = headerRef.current;
      if (!filterSection || !header) return;

      const scrollPosition = window.scrollY;
      const filterTop = filterSection.getBoundingClientRect().top + scrollPosition;
      const headerHeight = header.offsetHeight;
      const filterHeight = filterSection.offsetHeight;

      // Отладочные логи
      console.log('Scroll Position:', scrollPosition);
      console.log('Filter Top:', filterTop);
      console.log('Header Height:', headerHeight);
      console.log('Filter Height:', filterHeight);
      console.log('Threshold:', filterTop - headerHeight);

      // Фиксируем фильтр, если прокрутили ниже его верхней границы
      if (scrollPosition > filterTop - headerHeight) {
        if (!isFilterFixed) {
          setIsFilterFixed(true);
          console.log('Filter fixed');
        }
      } else {
        // Открепляем фильтр, если прокрутили выше
        if (isFilterFixed) {
          setIsFilterFixed(false);
          console.log('Filter unfixed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Обновляем при изменении размера окна
    handleScroll(); // Вызываем сразу для начальной проверки
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isFilterFixed]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get('country');
    const city = params.get('city');

    const filteredListings = allListings.filter(listing => {
      const [listingCity, listingCountry] = listing.location.split(', ').map(item => t(item, { lng: 'en' }));
      if (country && listingCountry !== country) return false;
      if (city && listingCity !== city) return false;
      return true;
    });

    setListings(filteredListings);

    const initialIndices = filteredListings.reduce((acc, listing) => {
      acc[listing.id] = 0;
      return acc;
    }, {});
    setCurrentImageIndices(initialIndices);
  }, [location, t, allListings]);

  const handlePrevImage = (listingId, imageCount) => {
    setCurrentImageIndices(prev => {
      const currentIndex = prev[listingId] || 0;
      const newIndex = (currentIndex - 1 + imageCount) % imageCount;
      return { ...prev, [listingId]: newIndex };
    });
  };

  const handleNextImage = (listingId, imageCount) => {
    setCurrentImageIndices(prev => {
      const currentIndex = prev[listingId] || 0;
      const newIndex = (currentIndex + 1) % imageCount;
      return { ...prev, [listingId]: newIndex };
    });
  };

  const handleDotClick = (listingId, index) => {
    setCurrentImageIndices(prev => ({ ...prev, [listingId]: index }));
  };

  const toggleFavorite = listingId => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  };

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
  };

  const changeCurrency = currency => {
    setSelectedCurrency(currency);
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

  const getFloorText = floor => {
    if (floor === 1) return `${floor}st`;
    if (floor === 2) return `${floor}nd`;
    if (floor === 3) return `${floor}rd`;
    return `${floor}th`;
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="listings-header" ref={headerRef}>
        <div className="listings-header-container">
          <div className="listings-header-left">
            <Link to="/">
              <img src={Logo} alt="Foruads Logo" className="listings-logo" />
            </Link>
            <div className="listings-header-title">
              <h3>FOR YOUR ADS</h3>
            </div>
          </div>
          <div className="listings-header-actions">
            <div className="listings-dropdown">
              <button className="listings-dropdown-btn">
                {languages.find(l => l.code === i18n.language)?.flag || '🌐'}{' '}
                {languages.find(l => l.code === i18n.language)?.name || 'Language'}
              </button>
              <div className="listings-dropdown-content">
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="listings-dropdown-item"
                  >
                    {lang.flag} {lang.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="listings-dropdown">
              <button className="listings-dropdown-btn">
                {currencies.find(c => c.code === selectedCurrency)?.symbol || '€'}{' '}
                {currencies.find(c => c.code === selectedCurrency)?.code || 'Currency'}
              </button>
              <div className="listings-dropdown-content">
                {currencies.map(currency => (
                  <div
                    key={currency.code}
                    onClick={() => changeCurrency(currency.code)}
                    className="listings-dropdown-item"
                  >
                    {currency.symbol} {currency.code}
                  </div>
                ))}
              </div>
            </div>
            <button className="listings-nav-btn listings-nav-btn-primary" onClick={handleRegisterClick}>
              <FiPlusCircle className="listings-nav-btn-icon" />
              {t('register')}
            </button>
            {isAuthenticated ? (
              <div className="listings-user-avatar">
                <FiUser className="listings-avatar-icon" />
              </div>
            ) : (
              <button className="listings-nav-btn" onClick={handleLoginClick}>
                <FiLogIn className="listings-nav-btn-icon" />
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="listings">
        <div className={`filter-section ${isFilterFixed ? 'fixed' : ''}`} ref={filterSectionRef}>
          <FilterListing
            setListings={setListings}
            allListings={allListings}
            currentImageIndices={currentImageIndices}
            setCurrentImageIndices={setCurrentImageIndices}
          />
        </div>
        <div className="listings-container">
          <div className="listings-list">
            {currentListings.map(listing => (
              <div key={listing.id} className="listing-card">
                <div className="listing-image-wrapper">
                  <div className="listing-image-container">
                    <img
                      src={listing.images[currentImageIndices[listing.id] || 0]}
                      alt={listing.title}
                      className="listing-image"
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          className="image-nav-button image-nav-left"
                          onClick={() => handlePrevImage(listing.id, listing.images.length)}
                        >
                          <FiChevronLeft />
                        </button>
                        <button
                          className="image-nav-button image-nav-right"
                          onClick={() => handleNextImage(listing.id, listing.images.length)}
                        >
                          <FiChevronRight />
                        </button>
                        <div className="image-dots">
                          {listing.images.map((_, index) => (
                            <span
                              key={index}
                              className={`image-dot ${
                                currentImageIndices[listing.id] === index ? 'active' : ''
                              }`}
                              onClick={() => handleDotClick(listing.id, index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    <button
                      className={`favorite-button ${favorites.has(listing.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(listing.id)}
                    >
                      <FiHeart />
                    </button>
                  </div>
                  {listing.images.length > 1 && (
                    <div className="listing-thumbnails">
                      {listing.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${listing.title} thumbnail ${index + 1}`}
                          className={`thumbnail-image ${
                            currentImageIndices[listing.id] === index ? 'active' : ''
                          }`}
                          onClick={() =>
                            setCurrentImageIndices(prev => ({ ...prev, [listing.id]: index }))
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="listing-details">
                  <Link to={`/listing/${listing.id}`} className="listing-link">
                    <h3>{listing.title}</h3>
                    <p className="price">{listing.price}</p>
                    <p className="location">{listing.location}</p>
                    <div className="listing-specs">
                      <span className="spec-property-type">
                        <span className="spec-label">
                          {listing.type === 'Apartment' ? 'Apartment' : listing.type}
                        </span>
                      </span>
                      <span>
                        <div className="spec-value">{listing.area} m²</div>
                        <div className="spec-label">{t('area')}</div>
                      </span>
                      {listing.floor !== null && (
                        <span>
                          <div className="spec-value">{getFloorText(listing.floor)}</div>
                          <div className="spec-label">{t('floor')}</div>
                        </span>
                      )}
                      <span>
                        <div className="spec-value">{listing.rooms}</div>
                        <div className="spec-label">{t('rooms')}</div>
                      </span>
                      <span>
                        <div className="spec-value">{listing.yearBuilt}</div>
                        <div className="spec-label">{t('yearBuilt')}</div>
                      </span>
                    </div>
                    <p className="description">{listing.description}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                {t('previous')}
              </button>
              <span className="pagination-info">
                {t('page')} {currentPage} {t('of')} {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                {t('next')}
              </button>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
}

export default Listings;