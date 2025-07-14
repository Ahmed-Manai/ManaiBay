import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Pagination, Button, Box } from '@mui/material';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import { useCart } from './CartContext';

// Simulated product data
const PRODUCTS = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  description: 'This is a great product for your needs.',
  image: `https://picsum.photos/seed/${i + 1}/300/200`,
  price: (Math.random() * 100 + 10).toFixed(2),
}));

const PAGE_SIZE = 8;

const EcommercePage = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cart, dispatch } = useCart();

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [page]);

  const paginatedProducts = PRODUCTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleBuy = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
    alert(`Added ${product.title} to cart!`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Shop Products</Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" color="secondary" href="/">Back to Home</Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ProductList products={paginatedProducts} onBuy={product => setSelectedProduct(product)} />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(PRODUCTS.length / PAGE_SIZE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
      <ProductDetails
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuy={handleBuy}
      />
    </Container>
  );
};

export default EcommercePage;
