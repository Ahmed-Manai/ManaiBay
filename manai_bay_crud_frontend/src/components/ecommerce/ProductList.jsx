import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

// Grid list of products

const ProductList = ({ products, onBuy, onEdit, onDelete, isAdmin, onProductClick }) => (
  <Grid container spacing={2} justifyContent="center">
    {products.map(product => (
      <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
