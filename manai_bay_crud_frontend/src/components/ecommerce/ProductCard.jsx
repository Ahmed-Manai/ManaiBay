import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: 'auto',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
}));

const ProductCard = ({ product, onBuy, onDelete, isAdmin, onProductClick }) => {
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/ecommerce/${product.id}`);
  };

  return (
    <StyledCard onClick={() => onProductClick(product)}>
      <CardMedia
        component="img"
        height="200"
        image={`data:image/jpeg;base64,${product.image_data}`}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', padding: '0 16px 16px' }}>
        {isAdmin ? (
          <>
            <Button variant="outlined" color="info" onClick={handleEditClick}>Edit</Button>
            <Button variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>Delete</Button>
          </>
        ) : (
          <Button variant="contained" color="primary" fullWidth onClick={(e) => { e.stopPropagation(); onBuy(product); }}>
            Add to Cart
          </Button>
        )}
      </CardActions>
    </StyledCard>
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
