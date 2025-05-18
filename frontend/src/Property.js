import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiMapPin, FiUserCheck, FiMessageSquare, FiHome, FiGrid, FiDroplet, FiDollarSign, FiShare2, FiCalendar, FiHeart, FiLogIn, FiUser } from 'react-icons/fi';
import CustomMap from './CustomMap';
import Logo from './assets/logo3.svg';
import './Property.css';

// Данные (в реальном проекте это будет API-запрос)
const listingsBuy = [
  {
    id: 1,
    title: 'modernApartment',
    price: '€250,000',
    location: 'Berlin, Germany',
    exactAddress: '123 Friedrichstraße, Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'A modern apartment in the heart of Berlin with stunning views and all amenities.',
    area: '75 m²',
    rooms: 3,
    bathrooms: 2,
    utilitiesCost: '€150/month',
    contact: { phone: '+49123456789' },
    houseInfo: { yearBuilt: 2018, type: 'Apartment', floor: '3rd', material: 'Brick', parking: 'Underground' },
    sellerInfo: { name: 'Anna Schmidt', isRealtor: true, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    publishedDate: '2025-04-15',
    views: 120,
  },
  {
    id: 2,
    title: 'cozyHouse',
    price: '€350,000',
    location: 'Paris, France',
    exactAddress: '45 Rue de Rivoli, Paris, France',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'A cozy house near the Eiffel Tower, perfect for a small family.',
    area: '120 m²',
    rooms: 4,
    bathrooms: 3,
    utilitiesCost: '€200/month',
    contact: { phone: '+33123456789' },
    houseInfo: { yearBuilt: 2015, type: 'House', floor: 'Ground', material: 'Stone', parking: 'Garage' },
    sellerInfo: { name: 'Marie Dubois', isRealtor: false, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    publishedDate: '2025-04-10',
    views: 150,
  },
];

const listingsRentLong = [
  {
    id: 3,
    title: 'spaciousFlat',
    price: '€1,200/month',
    location: 'Rome, Italy',
    exactAddress: '12 Via del Corso, Rome, Italy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'A spacious flat in the historic center of Rome, ideal for long-term rent.',
    area: '90 m²',
    rooms: 2,
    bathrooms: 1,
    utilitiesCost: '€100/month',
    contact: { phone: '+39123456789' },
    houseInfo: { yearBuilt: 2010, type: 'Flat', floor: '2nd', material: 'Concrete', parking: 'Street' },
    sellerInfo: { name: 'Luca Rossi', isRealtor: true, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    publishedDate: '2025-04-12',
    views: 80,
  },
  {
    id: 4,
    title: 'luxuryPenthouse',
    price: '€2,500/month',
    location: 'Amsterdam, Netherlands',
    exactAddress: '78 Keizersgracht, Amsterdam, Netherlands',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'A luxury penthouse with a canal view in Amsterdam.',
    area: '150 m²',
    rooms: 3,
    bathrooms: 2,
    utilitiesCost: '€250/month',
    contact: { phone: '+31123456789' },
    houseInfo: { yearBuilt: 2019, type: 'Penthouse', floor: '5th', material: 'Glass', parking: 'Private' },
    sellerInfo: { name: 'Sophie Bakker', isRealtor: true, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    publishedDate: '2025-04-08',
    views: 200,
  },
];

const listingsRentShort = [
  {
    id: 5,
    title: 'beachVilla',
    price: '€200/night',
    location: 'Barcelona, Spain',
    exactAddress: '34 Passeig Marítim, Barcelona, Spain',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'A beautiful beach villa for short-term rent in Barcelona.',
    area: '200 m²',
    rooms: 5,
    bathrooms: 4,
    utilitiesCost: 'Included',
    contact: { phone: '+34123456789' },
    houseInfo: { yearBuilt: 2017, type: 'Villa', floor: 'Ground', material: 'Wood', parking: 'Private' },
    sellerInfo: { name: 'Carlos García', isRealtor: false, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    publishedDate: '2025-04-14',
    views: 90,
  },
  {
    id: 6,
    title: 'cityStudio',
    price: '€80/night',
    location: 'Lisbon, Portugal',
    exactAddress: '56 Rua Augusta, Lisbon, Portugal',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'A cozy studio in the heart of Lisbon, perfect for a short stay.',
    area: '40 m²',
    rooms: 1,
    bathrooms: 1,
    utilitiesCost: 'Included',
    contact: { phone: '+351123456789' },
    houseInfo: { yearBuilt: 2012, type: 'Studio', floor: '1st', material: 'Brick', parking: 'None' },
    sellerInfo: { name: 'Ana Silva', isRealtor: false, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    publishedDate: '2025-04-11',
    views: 110,
  },
];

// Функция для получения координат по названию города (заглушка, в будущем заменить на API)
const getCoordinates = (location) => {
  const locationMap = {
    'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
    'Paris, France': { lat: 48.8566, lng: 2.3522 },
    'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
    'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
    'Madrid, Spain': { lat: 40.4168, lng: -3.7038 },
    'Vienna, Austria': { lat: 48.2082, lng: 16.3738 },
    'Riga, Latvia': { lat: 56.9496, lng: 24.1052 },
    'Lisbon, Portugal': { lat: 38.7223, lng: -9.1393 },
    'Stockholm, Sweden': { lat: 59.3293, lng: 18.0686 },
    'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
    'Zurich, Switzerland': { lat: 47.3769, lng: 8.5417 },
    'Nice, France': { lat: 43.7102, lng: 7.2620 },
  };
  return locationMap[location] || { lat: 51.5074, lng: -0.1278 };
};

// Функция для форматирования заголовка
const formatTitle = (titleKey, t) => {
  const translated = t(titleKey);
  return translated
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

function Property({ openLoginModal, isAuthenticated }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const allListings = useMemo(() => {
    return [...listingsBuy, ...listingsRentLong, ...listingsRentShort];
  }, []);

  useEffect(() => {
    const foundProperty = allListings.find((listing) => listing.id === parseInt(id));
    setProperty(foundProperty || null);
  }, [id, allListings]);

  const coordinates = property?.location ? getCoordinates(property.location) : { lat: 51.5074, lng: -0.1278 };
  const locationName = property?.location || 'Unknown Location';

  const whatsappLink = property?.contact?.phone
    ? `https://wa.me/${property.contact.phone}`
    : '#';

  const todayViews = Math.floor(Math.random() * 50) + 1;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: formatTitle(property.title, t),
        text: `Check out this property: ${formatTitle(property.title, t)} for ${property.price} in ${property.location}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Sharing is not supported on this device. You can copy the URL to share.');
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  // Логика для карусели
  const galleryImages = property ? [property.image, property.image, property.image, property.image] : [];
  const thumbnails = galleryImages.slice(1);
  const slidesToShow = 3;
  const maxSlides = thumbnails.length;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? maxSlides - slidesToShow : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides - slidesToShow ? 0 : prev + 1));
  };

  if (!property) {
    return (
      <div className="page-wrapper">
        <div className="not-found">
          <div className="not-found-container">
            <h2>{t('propertyNotFound')}</h2>
            <Link to="/" className="back-btn">
              <FiArrowLeft className="back-btn-icon" />
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <header className="property-header">
        <div className="property-header-container">
          <div className="property-header-left">
            <Link to="/">
              <img src={Logo} alt="4 Your Ads" className="property-logo" />
            </Link>
            <div className="property-header-title">
              <h1>FOR YOUR ADS</h1>
            </div>
          </div>
          <div className="property-header-actions">
            {isAuthenticated ? (
              <div className="property-user-avatar">
                <FiUser className="property-avatar-icon" />
              </div>
            ) : (
              <button className="property-nav-btn" onClick={openLoginModal}>
                <FiLogIn className="property-nav-btn-icon" />
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="property-details">
        <div className="property-content">
          <div className="property-left-column">
            <div className="property-gallery">
              <div className="main-image-container">
                <img src={property.image} alt={t(property.title)} className="main-image" />
              </div>
              <div className="thumbnail-gallery">
                <button className="carousel-arrow carousel-prev" onClick={handlePrevSlide}>
                  {'<'}
                </button>
                <div className="thumbnail-wrapper">
                  <div
                    className="thumbnail-track"
                    style={{
                      transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {thumbnails.map((img, index) => (
                      <div className="thumbnail-slide" key={`thumbnail-${index}`}>
                        <img
                          src={img}
                          alt={`${t(property.title)} Thumbnail ${index + 1}`}
                          className="thumbnail"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="carousel-arrow carousel-next" onClick={handleNextSlide}>
                  {'>'}
                </button>
              </div>
            </div>

            <div className="property-details-content">
              <div className="property-description">
                <h2>{t('description')}</h2>
                <p>{property.description || 'No description available.'}</p>
              </div>

              <div className="property-features">
                <h2>{t('features')}</h2>
                <div className="features-grid">
                  <div className="feature-item">
                    <FiHome className="feature-icon" />
                    <span className="feature-label">{t('area')}:</span>
                    <span>{property.area}</span>
                  </div>
                  <div className="feature-item">
                    <FiGrid className="feature-icon" />
                    <span className="feature-label">{t('rooms')}:</span>
                    <span>{property.rooms}</span>
                  </div>
                  <div className="feature-item">
                    <FiDroplet className="feature-icon" />
                    <span className="feature-label">{t('bathrooms')}:</span>
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="feature-item">
                    <FiDollarSign className="feature-icon" />
                    <span className="feature-label">{t('utilities')}:</span>
                    <span>{property.utilitiesCost}</span>
                  </div>
                </div>
              </div>

              <div className="property-map" id="map-section">
                <h2>{t('location')}</h2>
                <div className="map-container">
                  <CustomMap coordinates={coordinates} locationName={locationName} />
                </div>
              </div>

              <div className="property-meta">
                <p>
                  <span className="meta-label">{t('published')}:</span> {property.publishedDate}
                </p>
                <p className="views">
                  <span className="meta-label">{t('views')}:</span> {property.views} (+ {todayViews}{' '}
                  {t('today')})
                </p>
              </div>
            </div>
          </div>

          <div className="property-info">
            <button
              className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
              onClick={handleFavoriteToggle}
            >
              <FiHeart className="favorite-icon" />
            </button>

            <div className="property-header-price">
              <div className="title-price-wrapper">
                <h1>
                  {formatTitle(property.title, t)}{' '}
                  <span className="area-highlight">{property.area}</span>
                </h1>
                <span className="property-price">{property.price}</span>
              </div>
            </div>

            <div className="property-exact-address">
              <a href="#map-section" className="address-link">
                <FiMapPin className="address-icon" />
                <span>{property.exactAddress}</span>
              </a>
            </div>

            <div className="contact-buttons">
              {showPhone ? (
                <p className="phone-number">{property.contact.phone}</p>
              ) : (
                <button
                  className="contact-btn show-phone-btn"
                  onClick={() => setShowPhone(true)}
                >
                  {t('showPhone')}
                </button>
              )}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn whatsapp-btn"
              >
                <FiMessageSquare className="whatsapp-icon" />
                {t('whatsAppMessage')}
              </a>
              <button className="contact-btn book-btn">
                {t('bookViewing')}
              </button>
              <button className="share-btn" onClick={handleShare}>
                <FiShare2 className="share-icon" />
                {t('share')}
              </button>
            </div>

            <div className="property-seller-contact">
              <div className="seller-details">
                <div className="seller-header">
                  <img
                    src={property.sellerInfo.avatar}
                    alt={property.sellerInfo.name}
                    className="seller-avatar"
                  />
                  <h2>
                    {property.sellerInfo.name}{' '}
                    {property.sellerInfo.isRealtor && <FiUserCheck className="realtor-icon" />}
                  </h2>
                </div>
                <button
                  className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? t('unsubscribe') : t('subscribe')}
                </button>
              </div>
            </div>

            <div className="property-house-info">
              <div className="house-info-grid">
                <div className="house-info-item">
                  <FiHome className="house-info-icon" />
                  <span className="house-info-value">{property.area}</span>
                  <span className="house-info-label">{t('area')}</span>
                </div>
                <div className="house-info-item">
                  <FiGrid className="house-info-icon" />
                  <span className="house-info-value">{property.houseInfo.floor}</span>
                  <span className="house-info-label">{t('floor')}</span>
                </div>
                <div className="house-info-item">
                  <FiDroplet className="house-info-icon" />
                  <span className="house-info-value">{property.rooms}</span>
                  <span className="house-info-label">{t('rooms')}</span>
                </div>
                <div className="house-info-item">
                  <FiCalendar className="house-info-icon" />
                  <span className="house-info-value">{property.houseInfo.yearBuilt}</span>
                  <span className="house-info-label">{t('yearBuilt')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>{t('footerAbout')}</h3>
            <p>{t('footerAboutText')}</p>
          </div>
          <div>
            <h3>{t('footerSupport')}</h3>
            <p>{t('footerSupportEmail')}</p>
          </div>
          <div>
            <h3>{t('footerContacts')}</h3>
            <p>{t('footerPhone')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Property;