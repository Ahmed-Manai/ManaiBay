import { Box, Typography, Link, IconButton, Stack, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import React, { useEffect, useState } from 'react';

const Footer = () => {
  const theme = useTheme();
  const footerBg = theme.palette.mode === 'dark'
    ? theme.palette.primary.dark
    : theme.palette.primary.main;
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;
      // Only show if page is scrollable and user has scrolled down
      if (bodyHeight > windowHeight && scrollY > 20) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showFooter) return null;

  return (
    <Box component="footer" sx={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      zIndex: 1300,
      py: 0.5,
      px: 1.5,
      minHeight: 28,
      background: 'rgba(25, 118, 210, 0.98)',
      color: 'white',
      boxShadow: '0 -1px 8px rgba(25,118,210,0.08)',
      fontSize: 13,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
    }}>
      <Typography variant="caption" sx={{ opacity: 0.7, ml: 1 }}>
        © {new Date().getFullYear()} ManaiBay
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Link href="mailto:contact@manaibay.com" color="inherit" underline="hover" sx={{ fontSize: 13, opacity: 0.8 }}>
          Contact
        </Link>
        <IconButton color="inherit" href="https://facebook.com" target="_blank" size="small" sx={{ p: 0.5, mx: 0.2 }}><FacebookIcon fontSize="small" /></IconButton>
        <IconButton color="inherit" href="https://twitter.com" target="_blank" size="small" sx={{ p: 0.5, mx: 0.2 }}><TwitterIcon fontSize="small" /></IconButton>
        <IconButton color="inherit" href="https://instagram.com" target="_blank" size="small" sx={{ p: 0.5, mx: 0.2 }}><InstagramIcon fontSize="small" /></IconButton>
      </Stack>
    </Box>
  );
};

export default Footer;
