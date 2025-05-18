import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Property from './Property';
import Listings from './Listings'; // Импортируем Listings
import Login from './Login';
import Register from './Register';
import './index.css';
import './i18n';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                openLoginModal={openLoginModal}
                openRegisterModal={openRegisterModal}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/listings"
            element={
              <Listings
                openLoginModal={openLoginModal}
                openRegisterModal={openRegisterModal}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/property/:id"
            element={
              <Property
                openLoginModal={openLoginModal}
                openRegisterModal={openRegisterModal}
                isAuthenticated={isAuthenticated}
              />
            }
          />
        </Routes>
        {showLoginModal && (
          <Login
            onClose={closeModals}
            onSwitchToRegister={openRegisterModal}
            setAuthenticated={setAuthenticated}
          />
        )}
        {showRegisterModal && (
          <Register
            onClose={closeModals}
            onSwitchToLogin={openLoginModal}
            setAuthenticated={setAuthenticated}
          />
        )}
      </div>
    </Router>
  );
}

export default App;