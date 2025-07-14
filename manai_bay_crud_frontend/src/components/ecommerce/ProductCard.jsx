
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';


// Card component for displaying a product
const ProductCard = ({ product, onBuy }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ maxWidth: 300, m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
      onClick={() => navigate(`/ecommerce/${product.id}`)}
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
        <Button variant="contained" color="primary" fullWidth onClick={e => { e.stopPropagation(); onBuy(product); }}>
          Buy
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onBuy: PropTypes.func.isRequired,
};

export default ProductCard;
