
'use client';
import WelcomeCard from '../../../components/WelcomeCard'; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Divider } from '@mui/material';
import { Grid, Paper } from '@mui/material';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const analyses = [
  {
    label: 'Computer vision',
    image: '/Icones/icone_video.JPG',
    link: '/video',
  },
  {
    label: 'Traitement du signal audio',
    image: '/Icones/icone_audi.JPG',
    link: '/audio',
  },
  {
    label: 'Natural Language Processing',
    image: '/Icones/icone_texte.JPG',
    link: '/textuelle',
  },
];


interface EmotionRow {
  minute_group: number;
  emotion: string;
  count: number;
}


export default function HomePage() {


  const [message, setMessage] = useState("");
  // const [rows, setRows] = useState<TestRow[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);


useEffect(() => {
  fetch('/api/test')
    .then((res) => res.json())
    .then((data) => {
      const rows: EmotionRow[] = data.data;
      const grouped: { [minute: number]: any } = {};

      for (const row of rows) {
        const minute = row.minute_group;
        const emotion = row.emotion;
        const count = parseInt(row.count.toString(), 10);

        if (!grouped[minute]) grouped[minute] = { minute };
        grouped[minute][emotion] = count;
      }

      setChartData(Object.values(grouped));
    })
    .catch((err) => console.error('Erreur API:', err));
}, []);

  return (
    <Container sx={{ padding: '2rem' }}>
      <WelcomeCard />

      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Bienvenue sur l'application Assembl'IA !
        <br />
        Ce projet a pour objectif d’analyser, à l’aide de modèles de machine learning, les stratégies de communication des députés au sein de l’hémicycle.
Il a été développé en collaboration avec l’entreprise <strong>Seagus</strong> dans une démarche exploratoire mêlant intelligence artificielle et analyse comportementale.
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      <img
      src="/Images/Photo_legislature_17.jpg"
      alt="Assemblée nationale"
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: '2rem auto',
        display: 'block',
        borderRadius: '8px',
      }}
      />
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" sx={{ mt: 4 }}>
       3 axes d'analyse :
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        {analyses.map((item, index) => (
          <Grid item xs={12} sm={4} key={index} sx={{ textAlign: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                px: 2,         
                py: 1.5,     
                backgroundColor: '#E6E6FA',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {item.label}
              </Typography>
            </Paper>

            {/* Icône centrée en dessous, en dehors du conteneur */}
            <Link href={item.link}>
              <img
                src={item.image}
                alt={item.label}
                style={{
                  width: '60px',
                  height: '60px',
                  marginTop: '1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </Link>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      <Box sx={{ mt: 6, px: 2, py: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Mentions légales
        </Typography>

        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          Ce projet vise avant tout à mettre en place un pipeline de traitement audio sur Azure, 
          associé à des expérimentations autour de modèles de machine learning.  
          Les résultats présentés sont purement illustratifs et n’ont aucune visée politique ni interprétative.
          <br /><br />
          Nous utilisons, adaptons et exploitons des données publiques mises à disposition sous <strong>Licence Ouverte</strong> 
          par l’Assemblée nationale, via :
          <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
            <li>
              <a href="https://data.assemblee-nationale.fr" target="_blank" rel="noopener noreferrer">
                data.assemblee-nationale.fr
              </a>
            </li>
            <li>
              <a href="https://videos.assemblee-nationale.fr" target="_blank" rel="noopener noreferrer">
                videos.assemblee-nationale.fr
              </a>
            </li>
            <li>
              <a href="https://www.assemblee-nationale.fr/" target="_blank" rel="noopener noreferrer">
                assemblee-nationale.fr
              </a>
            </li>
          </ul>
          <br />
          <strong>La responsabilité de l’Assemblée nationale ne saurait être engagée en cas d’erreur.</strong>
          <br />
          <strong>Dernière mise à jour :</strong> 23 juin 2025
        </Typography>
      </Box>


    </Container>

  );
}

