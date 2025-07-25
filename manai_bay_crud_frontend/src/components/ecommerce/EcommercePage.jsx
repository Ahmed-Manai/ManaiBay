import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Pagination, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, CssBaseline, Skeleton, Grid, Backdrop } from '@mui/material';
import ProductList from './ProductList';
import AdminProductForm from './AdminProductForm';
import Header from './Header';
import Footer from '../Footer';
import { useCart } from './CartContext';
import productApi from '../../api/productApi';
import { useNavigate } from 'react-router-dom';
// import { useTheme } from '../../themeContext';

const PAGE_SIZE = 8;

const EcommercePage = () => {
  const userRole = window.localStorage.getItem('role');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminFormOpen, setAdminFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const { cart, dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  // const { theme, toggleTheme } = useTheme();

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
    <>
      <CssBaseline />
      <Header onSearch={handleSearch} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>ManaiBay Products</Typography>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* <Button variant="outlined" color="secondary" href="/">Back to Home</Button> */}
            {userRole === 'admin' && (
              <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
            )}
          </Box>
        </Box>
        {loading && (
          <Backdrop open={true} sx={{ color: '#fff', flexDirection: 'column', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress size={70} thickness={4.5} sx={{ color: '#1976d2', mb: 3 }} />
            <Box
              sx={{
                fontSize: 22,
                fontWeight: 600,
                color: '#1976d2',
                letterSpacing: 1,
                background: 'rgba(255,255,255,0.85)',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(25, 118, 210, 0.10)',
                textAlign: 'center',
                fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
              }}
            >
              Please wait...
            </Box>
          </Backdrop>
        )}
        {!loading && error ? (
          <Alert severity="error">{error}</Alert>
        ) : !loading && (
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
      <div style={{ height: 32 }} />
      <Footer />
    </>
  );
};

export default EcommercePage;
