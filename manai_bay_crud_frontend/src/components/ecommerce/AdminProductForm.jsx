import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';

const AdminProductForm = ({ open, onClose, onSubmit, initialProduct }) => {
  const [product, setProduct] = useState(initialProduct || {
    title: '',
    description: '',
    image_data: '',
    price: ''
  });

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    } else {
      setProduct({
        title: '',
        description: '',
        image_data: '',
        price: ''
      });
    }
  }, [initialProduct]);

  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, image_data: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit(product);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialProduct ? 'Update Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Title" name="title" value={product.title} onChange={handleChange} fullWidth />
          <TextField label="Description" name="description" value={product.description} onChange={handleChange} fullWidth />
          <TextField label="Price" name="price" value={product.price} onChange={handleChange} fullWidth type="number" />
          <Button
            variant="contained"
            component="label"
            fullWidth
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
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
