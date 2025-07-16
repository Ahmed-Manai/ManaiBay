import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../../api/productApi';
import { useCart } from './CartContext';

import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  TextField,
  Rating,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';


const StarRating = ({ rating }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Rating value={rating} readOnly precision={0.5} />
    <Typography sx={{ ml: 1 }}>({rating.toFixed(1)})</Typography>
  </Box>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const userRole = window.localStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    productApi.getProduct(id)
      .then(res => {
        setProduct(res.data);
        setEditedProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch product details');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', product });
    alert(`Added ${product.title} to cart!`);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProduct(prev => ({ ...prev, image_data: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await productApi.updateProduct(id, editedProduct);
      setProduct(res.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(id);
        navigate('/ecommerce');
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!product) {
    return <Alert severity="info">Product not found.</Alert>;
  }

  const averageRating = product.reviews.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Products
      </Button>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="500"
              image={`data:image/jpeg;base64,${product.image_data}`}
              alt={product.title}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {isEditing ? (
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={editedProduct.title}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography gutterBottom variant="h4" component="div">
                  {product.title}
                </Typography>
                <StarRating rating={averageRating} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                  ${product.price}
                </Typography>
                {isAdmin ? (
                  <Box>
                    <Button variant="outlined" color="info" onClick={handleEditToggle} sx={{ mr: 1 }}>
                      Edit Product
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleDelete}>
                      Delete Product
                    </Button>
                  </Box>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Reviews ({product.reviews.length})
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {product.reviews.length > 0 ? (
          product.reviews.map(review => (
            <Paper key={review.id} elevation={2} sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar>{review.user_name.charAt(0)}</Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1" component="div">
                    {review.user_name}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography>No reviews yet.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
