import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

// Modal for product details
const ProductDetails = ({ open, product, onClose, onBuy }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{product?.title}</DialogTitle>
    <DialogContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={product?.image} alt={product?.title} style={{ maxWidth: '100%', maxHeight: 240, marginBottom: 16 }} />
        <Typography variant="body1" gutterBottom>{product?.description}</Typography>
        <Typography variant="h6" color="primary">${product?.price}</Typography>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button variant="contained" color="primary" onClick={() => onBuy(product)}>
        Buy
      </Button>
    </DialogActions>
  </Dialog>
);

ProductDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  product: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onBuy: PropTypes.func.isRequired,
};

export default ProductDetails;
