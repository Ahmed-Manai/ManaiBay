import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, IconButton, Badge, Menu, MenuItem, Button, Switch, Tooltip, Select, FormControl, Box } from '@mui/material';
import { Search, ShoppingCart, AccountCircle } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../themeContext';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');

  const handleLangChange = (event) => {
    const newLang = event.target.value;
    setLang(newLang);
    i18n.changeLanguage(newLang);
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

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
   {/* Remove duplicate language selector here, keep only the one next to theme toggle */}
        {/* Theme toggle and page controls */}
        {minimal ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>

              <FormControl variant="standard" sx={{ minWidth: 80, ml: 2 }}>
                <Select
                  value={lang}
                  onChange={handleLangChange}
                  disableUnderline
                  sx={{ color: 'white', fontWeight: 400, '& .MuiSelect-icon': { color: 'white' } }}
                  renderValue={(value) => {
                    const flagStyle = { width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 };
                    switch (value) {
                      case 'en':
                        return <span><img src={require('../../assets/flags/gb.svg').default} alt="EN" style={flagStyle} />EN</span>;
                      case 'fr':
                        return <span><img src={require('../../assets/flags/fr.svg').default} alt="FR" style={flagStyle} />FR</span>;
                      case 'ar':
                        return <span><img src={require('../../assets/flags/tn.svg').default} alt="AR" style={flagStyle} />AR</span>;
                      default:
                        return value;
                    }
                  }}
                >
                  <MenuItem value="en">
                    <img src={require('../../assets/flags/gb.svg').default} alt="EN" style={{ width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 }} /> EN
                  </MenuItem>
                  <MenuItem value="fr">
                    <img src={require('../../assets/flags/fr.svg').default} alt="FR" style={{ width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 }} /> FR
                  </MenuItem>
                  <MenuItem value="ar">
                    <img src={require('../../assets/flags/tn.svg').default} alt="AR" style={{ width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 }} /> AR
                  </MenuItem>
                </Select>
              </FormControl>

                <Tooltip title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <Switch checked={theme === 'dark'} onChange={toggleTheme} color="default" />
              </Tooltip>
            </Box>
          </>
        ) : (
          <>
            {/* Navigation Buttons */}
            {window.localStorage.getItem('role') === 'admin' && (
              <Button color="inherit" component={Link} to="/clients">
                {t('clients', 'Clients')}
              </Button>
            )}
            <Button color="inherit" component={Link} to="/ecommerce">
              {t('shop', 'E-Commerce')}
            </Button>
            <Button color="inherit" component={Link} to="/cart">
              {t('cart', 'Cart')}
            </Button>
            {/* Search Bar */}
            <SearchBar>
              <SearchIconWrapper>
                <Search />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t('search', 'Search…')}
                inputProps={{ 'aria-label': t('search', 'search') }}
                onChange={(e) => onSearch(e.target.value)}
              />
            </SearchBar>
                    {/* Always show language selector */}
            <FormControl variant="standard" sx={{ minWidth: 80, mx: 1 }}>
              <Select
                value={lang}
                onChange={handleLangChange}
                disableUnderline
                sx={{ color: 'white', fontWeight: 400, '& .MuiSelect-icon': { color: 'white' } }}
                renderValue={(value) => {
                  const flagStyle = { width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 };
                  switch (value) {
                    case 'en':
                      return <span><img src={require('../../assets/flags/gb.svg').default} alt="EN" style={flagStyle} />EN</span>;
                    case 'fr':
                      return <span><img src={require('../../assets/flags/fr.svg').default} alt="FR" style={flagStyle} />FR</span>;
                    case 'ar':
                      return <span><img src={require('../../assets/flags/tn.svg').default} alt="AR" style={flagStyle} />AR</span>;
                    default:
                      return value;
                  }
                }}
              >
                <MenuItem value="en">
                  <img src={require('../../assets/flags/gb.svg').default} alt="EN" style={{ width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 }} /> EN
                </MenuItem>
                <MenuItem value="fr">
                  <img src={require('../../assets/flags/fr.svg').default} alt="FR" style={{ width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 }} /> FR
                </MenuItem>
                <MenuItem value="ar">
                  <img src={require('../../assets/flags/tn.svg').default} alt="AR" style={{ width: 22, height: 16, verticalAlign: 'middle', marginRight: 6 }} /> AR
                </MenuItem>
              </Select>
            </FormControl>
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
            {/* Account Icon */}
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
              <MenuItem onClick={() => { navigate('/account'); handleClose(); }}>{t('account', 'Account')}</MenuItem>
              <MenuItem onClick={handleLogout}>{t('logout', 'Logout')}</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;