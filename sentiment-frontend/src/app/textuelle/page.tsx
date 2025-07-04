'use client';
import WelcomeCardtext from '../../../components/WelcomeCardtext'; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Grid, Paper } from '@mui/material';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


interface Ligne {
  orateur: string;
  debut: number;
  fin: number;
  texte: string;
  sad: number;
  disgust: number;
  angry: number;
  neutral: number;
  fear: number;
  surprise: number;
  happy: number;
}


export default function TextTimelinePage() {
  const [rows, setRows] = useState<Ligne[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/test/texttimeline')
      .then((res) => res.json())
      .then((data) => {
        setRows(data.lignes || []);

        const emotionRaw = data.emotions || [];
        const grouped: { [minute: number]: any } = {};

        for (const row of emotionRaw) {
          const minute = row.minute;
          const emotion = row.emotion_dominante;
          const count = parseInt(row.occurrences.toString(), 10);

          if (!grouped[minute]) grouped[minute] = { minute };
          grouped[minute][emotion] = count;
        }

        setChartData(Object.values(grouped));
      })
      .catch((err) => console.error('Erreur API:', err));
  }, []);

  return (

    <Container sx={{ padding: '2rem' }}>
      <WelcomeCardtext />

      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
       Analyse des interventions :
      </Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
      La solution proposée repose sur l’analyse émotionnelle des interventions des parlementaires, extraites à partir des comptes rendus de séance disponibles aux formats PDF et XML.
Pour ce faire, un modèle de traitement automatique du langage naturel a été développé en s’appuyant sur CamemBERT, une version francophone du modèle BERT, préentraînée sur un large corpus en français. Ce modèle a été fine-tuné spécifiquement pour la classification des émotions en langue française, en distinguant sept catégories : Tristesse, Dégoût, Peur, Colère, Neutre, Surprise et Joie.
Les performances obtenues sur les données de validation sont encourageantes, avec une accuracy de 82,95 % et un F1-score de 82,69 %, démontrant la pertinence de cette approche pour l’analyse émotionnelle des débats parlementaires.
      </Typography>

      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mt: 6, fontWeight: 'bold' }}>
        Évolution des émotions détectées par minute :
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="minute" label={{ value: 'Minute', position: 'insideBottomRight', offset: -5 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="happy" stroke="#fdd835" />
          <Line type="monotone" dataKey="sad" stroke="#64b5f6" />
          <Line type="monotone" dataKey="angry" stroke="#e53935" />
          <Line type="monotone" dataKey="fear" stroke="#8e24aa" />
          <Line type="monotone" dataKey="neutral" stroke="#90a4ae" />
          <Line type="monotone" dataKey="surprise" stroke="#4db6ac" />
          <Line type="monotone" dataKey="disgust" stroke="#388e3c" />
        </LineChart>
      </ResponsiveContainer>

      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      {rows.map((row, idx) => (
        <Box key={idx} sx={{ mt: 3, mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {row.orateur} — de {row.debut}s à {row.fin}s
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            <em>Émotions détectées :</em><br />
            Sad: {(row.sad * 100).toFixed(1)}% — Disgust: {(row.disgust * 100).toFixed(1)}% — Angry: {(row.angry * 100).toFixed(1)}%<br />
            Neutral: {(row.neutral * 100).toFixed(1)}% — Fear: {(row.fear * 100).toFixed(1)}%<br />
            Surprise: {(row.surprise * 100).toFixed(1)}% — Happy: {(row.happy * 100).toFixed(1)}%
          </Typography>

          <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
            "{row.texte}"
          </Typography>

          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}
    </Container>
  );
}