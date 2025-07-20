import React from 'react';
import { useCart } from './CartContext';
import { Container, Typography, Button, Grid, Paper, IconButton, Box, CssBaseline } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import Header from './Header';
import Footer from '../Footer';

const CartPage = () => {
  const { cart, dispatch } = useCart();

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    }
  };

  const handleRemoveFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.1; // 10% tax
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  return (
    <>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cart.map(item => (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <img src={`data:image/jpeg;base64,${item.image_data}`} alt={item.title} width="100" />
                  <Box sx={{ flexGrow: 1, ml: 2 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography>${item.price.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                      <Remove />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                      <Add />
                    </IconButton>
                  </Box>
                  <IconButton onClick={() => handleRemoveFromCart(item.id)}>
                    <Delete />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, p: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography variant="h6">Taxes (10%): ${taxes.toFixed(2)}</Typography>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Total: ${total.toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Checkout
            </Button>
            <Button variant="outlined" color="error" sx={{ mt: 2, ml: 2 }} onClick={handleClearCart}>
              Clear Cart
            </Button>
          </Box>
        </>
      )}
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;