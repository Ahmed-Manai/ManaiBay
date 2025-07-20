import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  minWidth: 260,
  minHeight: 420,
  maxHeight: 420,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, minHeight: 160, maxHeight: 160, background: '#fafafa' }}>
        <img
          src={`data:image/jpeg;base64,${product.image_data}`}
          alt={product.title}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 2 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ minHeight: 32, maxHeight: 40, overflow: 'hidden' }}>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 36, maxHeight: 36, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.description}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            ${product.price}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', padding: '0 16px 16px', mt: 'auto' }}>
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
      </Box>
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
