import React, { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';

const AdminProductForm = ({ open, onClose, onSubmit, initialProduct }) => {
  const [product, setProduct] = useState(initialProduct || {
    title: '',
    description: '',
    image: '',
    price: ''
  });

  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(product);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialProduct ? 'Update Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Title" name="title" value={product.title} onChange={handleChange} fullWidth />
          <TextField label="Description" name="description" value={product.description} onChange={handleChange} fullWidth />
          <TextField label="Image URL" name="image" value={product.image} onChange={handleChange} fullWidth />
          <TextField label="Price" name="price" value={product.price} onChange={handleChange} fullWidth type="number" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">{initialProduct ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

AdminProductForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialProduct: PropTypes.object
};

export default AdminProductForm;
