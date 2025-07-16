import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Pagination, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ProductList from './ProductList';
import AdminProductForm from './AdminProductForm';
import SearchBar from './SearchBar';
import { useCart } from './CartContext';
import productApi from '../../api/productApi';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 8;

const EcommercePage = () => {
  const userRole = window.localStorage.getItem('role');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminFormOpen, setAdminFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    setError('');
    productApi.getProducts(searchTerm)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddProduct = () => {
    setEditProduct(null);
    setAdminFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setAdminFormOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await productApi.deleteProduct(productToDelete);
      setProducts(products.filter(p => p.id !== productToDelete));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleAdminFormSubmit = async (product) => {
    try {
      if (editProduct) {
        const res = await productApi.updateProduct(editProduct.id, product);
        setProducts(products.map(p => p.id === editProduct.id ? res.data : p));
      } else {
        const res = await productApi.createProduct(product);
        setProducts([res.data, ...products]);
      }
      setAdminFormOpen(false);
      fetchProducts(); // Refetch products to show the latest data
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleBuy = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
    alert(`Added ${product.title} to cart!`);
  };

  const handleProductClick = (product) => {
    navigate(`/ecommerce/${product.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Shop Products</Typography>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="secondary" href="/">Back to Home</Button>
          {userRole === 'admin' && (
            <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
          )}
        </Box>
        <SearchBar onSearch={handleSearch} />
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
            onDelete={userRole === 'admin' ? handleDeleteRequest : undefined}
            isAdmin={userRole === 'admin'}
            onProductClick={handleProductClick}
          />
          {userRole === 'admin' && (
            <AdminProductForm
              open={adminFormOpen}
              onClose={() => setAdminFormOpen(false)}
              onSubmit={handleAdminFormSubmit}
              initialProduct={editProduct}
            />
          )}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
            </DialogActions>
          </Dialog>
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
    </Container>
  );
};

export default EcommercePage;
