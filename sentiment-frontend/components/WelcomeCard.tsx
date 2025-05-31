'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function WelcomeCard() {
  return (
<Card sx={{ margin: '2rem auto', padding: '1rem', maxWidth: 800, textAlign: 'center' }}>
  <CardContent>
    <Typography variant="h2" component="div">
      Assembl'IA
    </Typography>
    <Typography sx={{ mt: 1.5, fontSize: '1.25rem' }} color="#7d7da1">
    Quelles sont les stratégies rhétoriques, entendues comme les techniques d'expression et de communication, mises en œuvre par les députés actifs lors des séances ?
    </Typography>
  </CardContent>
</Card>

  );
}