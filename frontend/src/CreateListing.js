import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogIn, FiPlusCircle } from 'react-icons/fi';
import Logo from './assets/logo3.svg';
import './CreateListing.css';

function CreateListing({ openLoginModal, openRegisterModal, isAuthenticated }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    currency: 'EUR',
    location: '',
    city: '',
    country: '',
    images: [],
    type: 'Apartment',
    dealType: 'buy',
    rentType: '',
    description: '',
    area: '',
    floor: '',
    rooms: '',
    yearBuilt: '',
  });
  const [imageFiles, setImageFiles] = useState([]);

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

  const propertyTypes = ['Apartment', 'House', 'Villa'];
  const dealTypes = ['buy', 'rent'];
  const rentTypes = ['rent_long', 'rent_short'];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const changeCurrency = (currency) => {
    setFormData({ ...formData, currency });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, images: imageUrls });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Listing:', formData);
    navigate('/listings');
  };

  const handleLoginClick = () => {
    if (openLoginModal) {
      openLoginModal();
    } else {
      console.error('openLoginModal is not provided');
    }
  };

  const handleCreateListingClick = () => {
    if (isAuthenticated) {
      navigate('/create-listing');
    } else {
      openLoginModal();
    }
  };

  return (
    <>
      <header className="create-listing-header">
        <div className="create-listing-header-container">
          <div className="create-listing-header-left">
            <Link to="/">
              <img src={Logo} alt="Foruads Logo" className="create-listing-logo" />
            </Link>
            <div className="create-listing-header-title">
              <h3>FOR YOUR ADS</h3>
            </div>
          </div>
          <div className="create-listing-header-actions">
            <div className="create-listing-dropdown">
              <button className="create-listing-dropdown-btn">
                {languages.find(l => l.code === i18n.language)?.flag || '🌐'}{' '}
                {languages.find(l => l.code === i18n.language)?.name || 'Language'}
              </button>
              <div className="create-listing-dropdown-content">
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="create-listing-dropdown-item"
                  >
                    {lang.flag} {lang.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="create-listing-dropdown">
              <button className="create-listing-dropdown-btn">
                {currencies.find(c => c.code === formData.currency)?.symbol || '€'}{' '}
                {currencies.find(c => c.code === formData.currency)?.code || 'Currency'}
              </button>
              <div className="create-listing-dropdown-content">
                {currencies.map(currency => (
                  <div
                    key={currency.code}
                    onClick={() => changeCurrency(currency.code)}
                    className="create-listing-dropdown-item"
                  >
                    {currency.symbol} {currency.code}
                  </div>
                ))}
              </div>
            </div>
            <button className="create-listing-nav-btn create-listing-nav-btn-primary" onClick={handleCreateListingClick}>
              <FiPlusCircle className="create-listing-nav-btn-icon" />
              {t('post_ad')}
            </button>
            {isAuthenticated ? (
              <div className="create-listing-user-avatar">
                <FiUser className="create-listing-avatar-icon" />
              </div>
            ) : (
              <button className="create-listing-nav-btn" onClick={handleLoginClick}>
                <FiLogIn className="create-listing-nav-btn-icon" />
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="create-listing">
        <div className="create-listing-container">
          <h1>{t('create_listing')}</h1>
          <form onSubmit={handleSubmit} className="create-listing-form">
            <div className="form-group">
              <label>{t('title')}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('price')}</label>
              <div className="price-input">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                <span>{currencies.find(c => c.code === formData.currency)?.symbol}</span>
              </div>
            </div>

            <div className="form-group">
              <label>{t('location')}</label>
              <div className="location-inputs">
                <input
                  type="text"
                  name="city"
                  placeholder={t('city')}
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder={t('country')}
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('images')}</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {formData.images.length > 0 && (
                <div className="image-preview">
                  {formData.images.map((image, index) => (
                    <img key={index} src={image} alt={`Preview ${index}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{t('property_type')}</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('deal_type')}</label>
              <select
                name="dealType"
                value={formData.dealType}
                onChange={handleInputChange}
                required
              >
                {dealTypes.map(type => (
                  <option key={type} value={type}>{t(type)}</option>
                ))}
              </select>
            </div>

            {formData.dealType === 'rent' && (
              <div className="form-group">
                <label>{t('rent_type')}</label>
                <select
                  name="rentType"
                  value={formData.rentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('select_rent_type')}</option>
                  {rentTypes.map(type => (
                    <option key={type} value={type}>{t(type)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>{t('description')}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('area')} (m²)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('floor')}</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>{t('rooms')}</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{t('yearBuilt')}</label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              {t('submit')}
            </button>
          </form>
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

export default CreateListing;