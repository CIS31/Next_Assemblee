
'use client';
import WelcomeCard from '../../../components/WelcomeCard'; 
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Grid, Paper } from '@mui/material';
import Link from 'next/link';

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
// interface Depute {
//   Nom: string;
//   Prenom: string;
//   Groupe: string;
// }
// interface Groupe {
//   libelle: string;
//   count: number;
// }
export default function HomePage() {
  // const [deputes, setDeputes] = useState<Depute[]>([]);
  // const [groupes, setGroupes] = useState<Groupe[]>([]);

  // useEffect(() => {
  //   axios
  //     .get('http://api/deputes') 
  //     .then((res) => setDeputes(res.data))
  //     .catch((err) => console.error('Erreur API:', err));
  // }, []);
  // useEffect(() => {
  //   axios
  //     .get('http://api/groupes')
  //     .then((res) => setGroupes(res.data))
  //     .catch((err) => console.error('Erreur API Groupes:', err));
  // }, []);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <Container sx={{ padding: '2rem' }}>
      <WelcomeCard />
      {/* rajout de ligne separateur */}
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      {/* rajout d'un titre */}
      {/* rajout d'une descritpion */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Bienvenue sur l'application Assembl'IA !
        Le but de cette application est d'analyser via des modèles de machine learning les stratégies de communication des députés 

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
                px: 2,         // padding horizontal
                py: 1.5,       // padding vertical réduit
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
{/* 
      <Typography variant="h6" sx={{ mt: 6}}>
      Répartition actuelle des groupes politiques ainsi que le nombre de députés actifs dans chaque groupe, c'est-à-dire ceux ayant participé à au moins un vote :
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      <Grid container spacing={2}>
        {groupes.map((groupe, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                textAlign: 'center',
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {groupe.libelle}
              </Typography>
              <Typography variant="body1">{groupe.count}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        5 premiers députés :
      </Typography>

      <List>
        {deputes.map((dep, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={`${dep.Nom} (${dep.Prenom})`}
                secondary={`Groupe : ${dep.Groupe}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List> */}

      <Typography variant="h6" sx={{ mt: 4 }}>
        Vidéo exemple :
      </Typography>

      <video
        controls
        width="100%"
        style={{ marginTop: '1rem', borderRadius: '8px' }}
      >
        <source src="/videos/output.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéo.
      </video>
      <div>
      <h1>Test API</h1>
      <p>Message from API: {message}</p>
      </div>

    </Container>

  );
}

