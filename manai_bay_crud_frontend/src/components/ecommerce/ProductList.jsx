import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

// Grid list of products
const ProductList = ({ products, onBuy }) => (
  <Grid container spacing={2} justifyContent="center">
    {products.map(product => (
      <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
        <ProductCard product={product} onBuy={onBuy} />
      </Grid>
    ))}
  </Grid>
);

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onBuy: PropTypes.func.isRequired,
};

export default ProductList;
