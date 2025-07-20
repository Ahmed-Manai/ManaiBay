import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import LoginPage from './LoginPage';
import EcommercePage from './components/ecommerce/EcommercePage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetailPage from './components/ecommerce/ProductDetailPage';
import CartPage from './components/ecommerce/CartPage';
import AccountPage from './components/AccountPage';
import { CartProvider } from './components/ecommerce/CartContext';
import { Button, Box } from '@mui/material';


const AppRoutes = () => (
  <CartProvider>
    <Router>
      {/* Navigation moved to Header/AppBar */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/ecommerce" element={<ProtectedRoute><EcommercePage /></ProtectedRoute>} />
        <Route path="/ecommerce/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  </CartProvider>
);

export default AppRoutes;
