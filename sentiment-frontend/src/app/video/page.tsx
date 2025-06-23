'use client';
import WelcomeCardvideo from '../../../components/WelcomeCardvideo'; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Grid, Paper } from '@mui/material';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const modelData = [
  { emotion: 'Angry', precision: '0.772' },
  { emotion: 'Disgust', precision: '1.000' },
  { emotion: 'Fear', precision: '0.838' },
  { emotion: 'Happy', precision: '0.822' },
  { emotion: 'Neutral', precision: '0.740' },
  { emotion: 'Sad', precision: '0.943' },
  { emotion: 'Surprise', precision: '0.928' },
];
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
  const [chartData, setChartData] = useState<any[]>([]);


useEffect(() => {
  fetch('/api/test')
    .then((res) => res.json())
    .then((data) => {
      const rows: EmotionRow[] = data.data;

      // Transformer en { minute: 0, happy: 133, neutral: 19, ... }
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

      <WelcomeCardvideo />

      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
       Fonctionnalités principales :
      </Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
      L’analyse commence par une lecture image par image de la vidéo. Afin d’alléger le traitement, le système ne traite qu’une image sur dix, ce qui correspond à un échantillonnage raisonnable tout en conservant une bonne précision. Lorsqu’un visage est suffisamment grand et bien visible, une analyse des émotions est déclenchée. Les deux émotions dominantes sont alors identifiées et directement annotées sur la vidéo. En parallèle, une timeline CSV est générée, retraçant pour chaque minute les émotions détectées, ce qui facilite leur visualisation et leur exploitation.
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />


      <video
        controls
        width="100%"
        style={{ marginTop: '2rem', borderRadius: '8px' }}
      >
        <source src="https://azbstelecomparis.blob.core.windows.net/data/video/output/h264_output_video_test.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéo.
      </video>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        Pipeline technique (Azure + Databricks) :
      </Typography>
        <Typography variant="h6" sx={{ mt: 4 }}>
        Le pipeline repose sur l’infrastructure Azure et Databricks, assurant automatisation et scalabilité. Le système récupère automatiquement la dernière vidéo disponible sur Azure Blob Storage, déclenche le traitement IA (détection des visages, émotions, annotation), puis enregistre en sortie la vidéo annotée et sa timeline CSV dans le même espace de stockage. Enfin, les données de timeline sont sauvegardées dans une base de données PostgreSQL, permettant une analyse graphique via cette page web.
      </Typography>
     
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        Modèles d’IA utilisés :
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <span>
                <strong>YOLO v8</strong> pour la détection de visages –{' '}
                <Link href="https://yolov8.com/" target="_blank" rel="noopener noreferrer">
                  https://yolov8.com/
                </Link>
              </span>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <span>
                <strong>Modèle HuggingFace</strong> pour la détection d’émotions –{' '}
                <Link href="https://huggingface.co/dima806/facial_emotions_image_detection" target="_blank" rel="noopener noreferrer">
                  facial_emotions_image_detection
                </Link>
              </span>
            }
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        Évaluation des performances :
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Les modèles ont été évalués sur le dataset suivant :
        <Link href="https://www.kaggle.com/datasets/ananthu017/emotion-detection-fer" target="_blank" rel="noopener noreferrer">
          {' '}Kaggle FER Dataset
        </Link>
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Émotion</strong></TableCell>
              <TableCell><strong>Précision</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modelData.map((row) => (
              <TableRow key={row.emotion}>
                <TableCell>{row.emotion}</TableCell>
                <TableCell>{row.precision}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        <strong>Précision globale :</strong> 0.847
      </Typography>
      <Divider sx={{ my: 4 }} />



      <Typography variant="h5" sx={{ mt: 6 }}>
        Évolution des émotions détectées par minute :
      </Typography>

      <LineChart width={900} height={500} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="minute" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="happy" stroke="#8884d8" />
        <Line type="monotone" dataKey="neutral" stroke="#82ca9d" />
        <Line type="monotone" dataKey="angry" stroke="#ff7300" />
        <Line type="monotone" dataKey="sad" stroke="#888888" />
        <Line type="monotone" dataKey="surprise" stroke="#ff00ff" />
      </LineChart>



    </Container>

  );
}

