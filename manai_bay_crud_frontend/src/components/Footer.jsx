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
      py: 1,
      px: 2,
      minHeight: 40,
      background: footerBg,
      color: 'white',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
      textAlign: 'center',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    }}>
      <Typography variant="body2" sx={{ opacity: 0.7, mr: 2 }}>
        © {new Date().getFullYear()} All rights reserved.
      </Typography>
      <Link href="mailto:contact@manaibay.com" color="inherit" underline="hover" sx={{ mx: 1 }}>
        Contact
      </Link>
      <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
        Privacy Policy
      </Link>
      <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
        Terms of Use
      </Link>
      <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
        <IconButton color="inherit" href="https://facebook.com" target="_blank" size="small"><FacebookIcon fontSize="small" /></IconButton>
        <IconButton color="inherit" href="https://twitter.com" target="_blank" size="small"><TwitterIcon fontSize="small" /></IconButton>
        <IconButton color="inherit" href="https://instagram.com" target="_blank" size="small"><InstagramIcon fontSize="small" /></IconButton>
      </Stack>
    </Box>
  );
};

export default Footer;
