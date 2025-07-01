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

const getCoordinates = (location) => {
  const locationMap = {
    'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
    'Paris, France': { lat: 48.8566, lng: 2.3522 },
    'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
    'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
    'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
    'Lisbon, Portugal': { lat: 38.7223, lng: -9.1393 },
  };
  return locationMap[location] || { lat: 51.5074, lng: -0.1278 };
};

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

  const allListings = useMemo(() => [...listingsBuy, ...listingsRentLong, ...listingsRentShort], []);

  useEffect(() => {
    const foundProperty = allListings.find((listing) => listing.id === parseInt(id));
    setProperty(foundProperty || null);
  }, [id, allListings]);

  const coordinates = property?.location ? getCoordinates(property.location) : { lat: 51.5074, lng: -0.1278 };
  const whatsappLink = property?.contact?.phone ? `https://wa.me/${property.contact.phone.replace(/^\+/, '')}` : '#';
  const todayViews = Math.floor(Math.random() * 50) + 1;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: formatTitle(property.title, t),
        text: `${formatTitle(property.title, t)} - ${property.price} in ${property.location}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      alert(t('shareNotSupported'));
    }
  };

  const handleFavoriteToggle = () => {
    if (isAuthenticated) setIsFavorite(!isFavorite);
    else openLoginModal();
  };

  const handleSlideChange = (index) => setCurrentSlide(index);

  if (!property) {
    return (
      <div className="page-wrapper">
        <div className="not-found">
          <div className="not-found-container">
            <h2>{t('propertyNotFound')}</h2>
            <Link to="/" className="back-btn">
              <FiArrowLeft className="back-btn-icon" /> {t('backToHome')}
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
                <FiLogIn className="property-nav-btn-icon" /> {t('login')}
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
                <img src={property.image} alt={formatTitle(property.title, t)} className="main-image" />
              </div>
              <div className="thumbnail-gallery">
                <button className="carousel-arrow prev" onClick={() => handleSlideChange(currentSlide - 1 < 0 ? 2 : currentSlide - 1)}>
                  {'<'}
                </button>
                <div className="thumbnail-wrapper">
                  <div className="thumbnail-track" style={{ transform: `translateX(-${currentSlide * 33.33}%)`, transition: 'transform 0.3s ease' }}>
                    {[property.image, property.image, property.image].map((img, index) => (
                      <div key={index} className="thumbnail-slide">
                        <img src={img} alt={`${formatTitle(property.title, t)} Thumbnail ${index + 1}`} className="thumbnail" onClick={() => handleSlideChange(index)} />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="carousel-arrow next" onClick={() => handleSlideChange((currentSlide + 1) % 3)}>
                  {'>'}
                </button>
              </div>
            </div>

            <div className="property-description">
              <h2>{t('description')}</h2>
              <p>{property.description}</p>
            </div>

            <div className="property-features">
              <h2>{t('features')}</h2>
              <div className="features-grid">
                <div className="feature-item"><FiHome className="feature-icon" /><span>{t('area')}:</span> {property.area}</div>
                <div className="feature-item"><FiGrid className="feature-icon" /><span>{t('rooms')}:</span> {property.rooms}</div>
                <div className="feature-item"><FiDroplet className="feature-icon" /><span>{t('bathrooms')}:</span> {property.bathrooms}</div>
                <div className="feature-item"><FiDollarSign className="feature-icon" /><span>{t('utilities')}:</span> {property.utilitiesCost}</div>
              </div>
            </div>

            <div className="property-map">
              <h2>{t('location')}</h2>
              <div className="map-container">
                <CustomMap coordinates={coordinates} locationName={property.location} />
              </div>
            </div>
          </div>

          <div className="property-info">
            <button className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`} onClick={handleFavoriteToggle}>
              <FiHeart className="favorite-icon" />
            </button>

            <div className="property-header-price">
              <h1>{formatTitle(property.title, t)} <span className="area-highlight">{property.area}</span></h1>
              <span className="property-price">{property.price}</span>
            </div>

            <div className="property-exact-address">
              <a href="#map-section" className="address-link">
                <FiMapPin className="address-icon" /> {property.exactAddress}
              </a>
            </div>

            <div className="contact-buttons">
              {showPhone ? (
                <p className="phone-number">{property.contact.phone}</p>
              ) : (
                <button className="contact-btn show-phone" onClick={() => setShowPhone(true)}>
                  {t('showPhone')}
                </button>
              )}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp">
                <FiMessageSquare className="whatsapp-icon" /> {t('whatsAppMessage')}
              </a>
              <button className="contact-btn book">{t('bookViewing')}</button>
              <button className="contact-btn share" onClick={handleShare}>
                <FiShare2 className="share-icon" /> {t('share')}
              </button>
            </div>

            <div className="property-seller">
              <div className="seller-header">
                <img src={property.sellerInfo.avatar} alt={property.sellerInfo.name} className="seller-avatar" />
                <h2>{property.sellerInfo.name} {property.sellerInfo.isRealtor && <FiUserCheck className="realtor-icon" />}</h2>
              </div>
              <button className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`} onClick={() => setIsSubscribed(!isSubscribed)}>
                {isSubscribed ? t('unsubscribe') : t('subscribe')}
              </button>
            </div>

            <div className="property-house-info">
              <div className="house-info-grid">
                <div className="house-info-item"><FiHome className="house-info-icon" /><span>{property.area}</span><span>{t('area')}</span></div>
                <div className="house-info-item"><FiGrid className="house-info-icon" /><span>{property.houseInfo.floor}</span><span>{t('floor')}</span></div>
                <div className="house-info-item"><FiCalendar className="house-info-icon" /><span>{property.houseInfo.yearBuilt}</span><span>{t('yearBuilt')}</span></div>
              </div>
            </div>

            <div className="property-meta">
              <p><span>{t('published')}:</span> {property.publishedDate}</p>
              <p className="views"><span>{t('views')}:</span> {property.views} (+{todayViews} {t('today')})</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div><h3>{t('footerAbout')}</h3><p>{t('footerAboutText')}</p></div>
          <div><h3>{t('footerSupport')}</h3><p>{t('footerSupportEmail')}</p></div>
          <div><h3>{t('footerContacts')}</h3><p>{t('footerPhone')}</p></div>
        </div>
      </footer>
    </div>
  );
}

export default Property;