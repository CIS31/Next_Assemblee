'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function WelcomeCard() {
  return (
<Card sx={{ margin: '2rem auto', padding: '1rem', maxWidth: 800, textAlign: 'center' }}>
  <CardContent>
    <Typography variant="h2" component="div">
      Analyse Audio 
    </Typography>
    <Typography sx={{ mt: 1.5, fontSize: '1.25rem' }} color="#7d7da1">
    Cette section de l’application repose sur un pipeline complet de traitement audio destiné à analyser la tonalité des intervenants à partir d’enregistrements.
    </Typography>
  </CardContent>
</Card>

  );
}