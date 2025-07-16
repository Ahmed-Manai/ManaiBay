
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';


// Card component for displaying a product

const ProductCard = ({ product, onBuy, onDelete, isAdmin, onProductClick }) => {
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/ecommerce/${product.id}`);
  };

  return (
    <Card
      sx={{ maxWidth: 300, m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
      onClick={() => onProductClick(product)}
    >
      <CardMedia
        component="img"
        height="180"
        image={product.image}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>{product.title}</Typography>
        <Typography variant="body2" color="text.secondary">{product.description}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>${product.price}</Typography>
      </CardContent>
      <CardActions>
        {isAdmin ? (
          <>
            <Button variant="outlined" color="info" onClick={handleEditClick} sx={{ ml: 1 }}>Edit</Button>
            <Button variant="outlined" color="error" onClick={e => { e.stopPropagation(); onDelete(product.id); }} sx={{ ml: 1 }}>Delete</Button>
          </>
        ) : (
          <Button variant="contained" color="primary" fullWidth onClick={e => { e.stopPropagation(); onBuy(product); }}>
            Buy
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onBuy: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isAdmin: PropTypes.bool,
  onProductClick: PropTypes.func,
};

export default ProductCard;
