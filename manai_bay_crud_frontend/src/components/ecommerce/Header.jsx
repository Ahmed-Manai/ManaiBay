import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, IconButton, Badge, Menu, MenuItem, Button, Switch, Tooltip } from '@mui/material';
import { Search, ShoppingCart, AccountCircle } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../themeContext';

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = ({ onSearch, onLogout, minimal }) => {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.localStorage.clear();
      navigate('/');
    }
    handleClose();
    // Force a reload to reset AppBar state for login page
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          ManaiBay
        </Typography>
        {/* Only show theme toggle on minimal (login/register) */}
        {minimal ? (
          <Tooltip title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Switch checked={theme === 'dark'} onChange={toggleTheme} color="default" />
          </Tooltip>
        ) : (
          <>
            {/* Navigation Buttons */}
            {window.localStorage.getItem('role') === 'admin' && (
              <Button color="inherit" component={Link} to="/clients">
                Clients
              </Button>
            )}
            <Button color="inherit" component={Link} to="/ecommerce">
              E-Commerce
            </Button>
            <Button color="inherit" component={Link} to="/cart">
              Cart
            </Button>
            {/* Search Bar */}
            <SearchBar>
              <SearchIconWrapper>
                <Search />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => onSearch(e.target.value)}
              />
            </SearchBar>
            {/* Theme Toggle Switch */}
            <Tooltip title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <Switch checked={theme === 'dark'} onChange={toggleTheme} color="default" />
            </Tooltip>
            {/* Cart Icon */}
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/account'); handleClose(); }}>Account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;