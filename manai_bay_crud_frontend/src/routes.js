import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import EcommercePage from './components/ecommerce/EcommercePage';
import ProductDetailPage from './components/ecommerce/ProductDetailPage';
import { CartProvider } from './components/ecommerce/CartContext';
import { Button, Box } from '@mui/material';

const Navigation = () => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
    <Button component={Link} to="/" variant="outlined" color="primary">Clients</Button>
    <Button component={Link} to="/ecommerce" variant="outlined" color="secondary">E-Commerce</Button>
  </Box>
);

const AppRoutes = () => (
  <CartProvider>
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ecommerce" element={<EcommercePage />} />
        <Route path="/ecommerce/:productId" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  </CartProvider>
);

export default AppRoutes;
