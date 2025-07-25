import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

const ProductList = ({ products, onBuy, onEdit, onDelete, isAdmin, onProductClick }) => (
  <Grid
    container
    spacing={4}
    justifyContent="center"
    sx={{
      width: '95vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      ml: '-50vw',
      mr: '-50vw',
      px: { xs: 2, sm: 6, md: 10, lg: 16 },
      boxSizing: 'border-box',
    }}
  >
    {products.map(product => (
      <Grid
        item
        key={product.id}
        xs={12}
        sm={6}
        md={4}
        lg={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <ProductCard
          product={product}
          onBuy={onBuy}
          onEdit={isAdmin ? () => onEdit(product) : undefined}
          onDelete={isAdmin ? () => onDelete(product.id) : undefined}
          isAdmin={isAdmin}
          onProductClick={() => onProductClick(product)}
        />
      </Grid>
    ))}
  </Grid>
);

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onBuy: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isAdmin: PropTypes.bool,
  onProductClick: PropTypes.func,
};

export default ProductList;
