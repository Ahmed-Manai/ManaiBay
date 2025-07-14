import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Button, Box, Paper, Rating } from '@mui/material';
import { useCart } from './CartContext';

// Simulated product data
const PRODUCTS = Array.from({ length: 30 }).map((_, i) => ({
  id: (i + 1).toString(),
  title: `Product ${i + 1}`,
  description: 'This is a great product for your needs. Full details and specs are shown here.',
  image: `https://picsum.photos/seed/${i + 1}/400/300`,
  price: (Math.random() * 100 + 10).toFixed(2),
  reviews: [
    { user: 'Alice', rating: 5, comment: 'Amazing product!' },
    { user: 'Bob', rating: 4, comment: 'Very good value.' },
  ],
}));

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    const timer = setTimeout(() => {
      const found = PRODUCTS.find(p => p.id === productId);
      setProduct(found);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [productId]);

  const handleBuy = () => {
    dispatch({ type: 'ADD_TO_CART', product });
    alert(`Added ${product.title} to cart!`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">Product not found.</Typography>
        <Button variant="outlined" color="primary" onClick={() => navigate('/ecommerce')}>Back to Products</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button variant="outlined" color="secondary" sx={{ mb: 2 }} onClick={() => navigate('/ecommerce')}>
        Back to Products
      </Button>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8 }} />
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h4" gutterBottom>{product.title}</Typography>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>${product.price}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
          <Button variant="contained" color="primary" size="large" onClick={handleBuy} sx={{ mb: 3 }}>
            Buy
          </Button>
          <Typography variant="h6" sx={{ mt: 2 }}>Reviews</Typography>
          {product.reviews.map((review, idx) => (
            <Paper key={idx} sx={{ p: 2, my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2">{review.user}</Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
              <Typography variant="body2">{review.comment}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductDetailPage;
