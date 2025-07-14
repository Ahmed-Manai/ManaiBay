import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Pagination, Button, Box } from '@mui/material';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import AdminProductForm from './AdminProductForm';
import { useCart } from './CartContext';
import productApi from '../../api/productApi';

const PAGE_SIZE = 8;

const EcommercePage = () => {
  // Get user role from localStorage (set after login)
  const userRole = window.localStorage.getItem('role');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adminFormOpen, setAdminFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const { cart, dispatch } = useCart();

  // Fetch products from backend
  useEffect(() => {
    setLoading(true);
    setError('');
    productApi.getProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, [page]);

  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Admin actions
  const handleAddProduct = () => {
    setEditProduct(null);
    setAdminFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setAdminFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productApi.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleAdminFormSubmit = async (product) => {
    try {
      if (editProduct) {
        // Update
        const res = await productApi.updateProduct(editProduct.id, product);
        setProducts(products.map(p => p.id === editProduct.id ? res.data : p));
      } else {
        // Add
        const res = await productApi.createProduct(product);
        setProducts([res.data, ...products]);
      }
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleBuy = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
    alert(`Added ${product.title} to cart!`);
  };

  // Edit product when clicking on item (admin only)
  const handleProductClick = (product) => {
    if (userRole === 'admin') {
      handleEditProduct(product);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Shop Products</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" color="secondary" href="/">Back to Home</Button>
        {userRole === 'admin' && (
          <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
        )}
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
        <ProductList
          products={paginatedProducts}
          onBuy={handleBuy}
          onEdit={userRole === 'admin' ? handleEditProduct : undefined}
          onDelete={userRole === 'admin' ? handleDeleteProduct : undefined}
          isAdmin={userRole === 'admin'}
          onProductClick={handleProductClick}
        />
          {/* Admin product form dialog */}
          {userRole === 'admin' && (
            <AdminProductForm
              open={adminFormOpen}
              onClose={() => setAdminFormOpen(false)}
              onSubmit={handleAdminFormSubmit}
              initialProduct={editProduct}
            />
          )}
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(products.length / PAGE_SIZE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
      <ProductDetails
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuy={handleBuy}
      />
    </Container>
  );
};

export default EcommercePage;
