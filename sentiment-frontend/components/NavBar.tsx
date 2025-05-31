'use client';

import { AppBar, Toolbar, Button, Container } from '@mui/material';
import Link from 'next/link';

const navItems = [
  { label: 'Informations générales', path: '/informations' },
  { label: 'Analyse vidéo', path: '/video' },
  { label: 'Analyse audio', path: '/audio' },
  { label: 'Analyse textuelle', path: '/textuelle' },
];

export default function NavBar() {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      {/* <Container maxWidth="lg"> */}
        <Toolbar sx={{ gap: 4 , backgroundColor: '#E6E6FA' }}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <Button 
                color="inherit" 
                sx={{ 
                  textTransform: 'none', 
                  // fontWeight: 'bold',
                  fontSize: '1rem',
                   }}>{item.label}</Button>
            </Link>
          ))}
        </Toolbar>
      {/* </Container> */}
    </AppBar>
  );
}
