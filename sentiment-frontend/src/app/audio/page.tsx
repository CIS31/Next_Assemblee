'use client';

'use client';
import WelcomeCardaudio from '../../../components/WelcomeCardaudio'; 
import axios from 'axios';
import { Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Grid, Paper } from '@mui/material';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface GanttSegment {
  speaker: string;
  start: number;
  duration: number;
}
interface IntensityPoint {
  speaker: string;
  time: number;
  intensity: number;
}

export default function AudioPage() {
  const [ganttData, setGanttData] = useState<Record<string, GanttSegment[]>>({});
  const [intensityData, setIntensityData] = useState<Record<string, IntensityPoint[]>>({});

  useEffect(() => {
    fetch('/api/test/audio')
      .then((res) => res.json())
      .then((res) => {
        // Gantt
        const groupedGantt: Record<string, GanttSegment[]> = {};
        res.gantt.forEach((d: GanttSegment) => {
          if (!groupedGantt[d.speaker]) groupedGantt[d.speaker] = [];
          groupedGantt[d.speaker].push(d);
        });
        setGanttData(groupedGantt);

        // Intensity
        const groupedIntensity: Record<string, IntensityPoint[]> = {};
        res.intensity.forEach((d: IntensityPoint) => {
          if (!groupedIntensity[d.speaker]) groupedIntensity[d.speaker] = [];
          groupedIntensity[d.speaker].push(d);
        });
        setIntensityData(groupedIntensity);
        // Pitch
        const groupedPitch: Record<string, { speaker: string; time: number; pitch: number }[]> = {};
        res.pitch.forEach((d: any) => {
          if (!groupedPitch[d.speaker]) groupedPitch[d.speaker] = [];
          groupedPitch[d.speaker].push(d);
        });
        setPitchData(groupedPitch);

      });
  }, []);

  const speakers = Object.keys(ganttData);
  const rowHeight = 30;
  const barHeight = 14;
  const leftMargin = 120;
  const pixelsPerSecond = 2;
  const tickInterval = 120;

  const allSegments = Object.values(ganttData).flat().map((s) => s.start + s.duration);
  const maxTime = Math.max(...allSegments, 600);
  const svgWidth = leftMargin + maxTime * pixelsPerSecond;
  const svgHeight = speakers.length * rowHeight + 40;

  const formatMinutes = (s: number) => {
    const minutes = Math.floor(s / 60);
    const hours = Math.floor(minutes / 60);
    const displayMin = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(displayMin).padStart(2, '0')}`;
  };

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
  const [pitchData, setPitchData] = useState<Record<string, { speaker: string; time: number; pitch: number }[]>>({});

  return (
      <Container sx={{ padding: '2rem' }}>
      <WelcomeCardaudio />
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
       Objectifs de l’analyse :
      </Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
      Cette analyse se concentre sur l’extraction et l’étude des caractéristiques prosodiques du langage parlé, ainsi que sur la diarisation des locuteurs.
      <br />
      L’objectif principal est de répondre aux questions : “Qui parle, quand, et comment ?”
      Cela inclut la détection de la hauteur (pitch) et de l’intensité (volume) de la voix, permettant une compréhension des dynamiques vocales et des interactions entre intervenants.
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        Gantt des Prises de Parole
        <br />
      </Typography>

      <Box sx={{ overflowX: 'auto', width: '100%', mb: 4 }}>
        <svg width={svgWidth} height={svgHeight}>
          {/* Y Axis speaker labels */}
          {speakers.map((speaker, i) => (
            <text
              key={speaker}
              x={0}
              y={i * rowHeight + rowHeight / 2 + 5}
              fontSize={12}
              fontFamily="sans-serif"
            >
              {speaker}
            </text>
          ))}

          {/* Bars */}
          {speakers.map((speaker, i) =>
            ganttData[speaker].map((seg, j) => (
              <rect
                key={`${speaker}-${j}`}
                x={leftMargin + seg.start * pixelsPerSecond}
                y={i * rowHeight + (rowHeight - barHeight) / 2}
                width={seg.duration * pixelsPerSecond}
                height={barHeight}
                fill={colors[i % colors.length]}
                stroke="#333"
                strokeWidth="0.5"
              />
            ))
          )}

          {/* X Axis ticks */}
          {Array.from({ length: Math.ceil(maxTime / tickInterval) + 1 }, (_, i) => i * tickInterval).map((s) => (
            <g key={s}>
              <line
                x1={leftMargin + s * pixelsPerSecond}
                y1={0}
                x2={leftMargin + s * pixelsPerSecond}
                y2={svgHeight}
                stroke="#ccc"
                strokeDasharray="2 2"
              />
              <text
                x={leftMargin + s * pixelsPerSecond}
                y={svgHeight - 5}
                fontSize={10}
                textAnchor="middle"
                fill="#333"
              >
                {formatMinutes(s)}
              </text>
            </g>
          ))}
        </svg>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      {/* LINE CHART INTENSITY */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        Intensité sonore (dB)
        <br />
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            tickFormatter={(v) => formatMinutes(v)}
            label={{ value: 'Temps (min)', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            domain={['auto', 'auto']}
            label={{ value: 'Intensité (dB)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          {speakers.map((speaker, i) => (
            <Line
              key={speaker}
              data={intensityData[speaker]}
              dataKey="intensity"
              name={speaker}
              stroke={colors[i % colors.length]}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Divider sx={{ my: 4 }} />
      <Divider sx={{ my: 4 }} />
      {/* PITCH GRAPH */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        Hauteur de voix (Hz)
        <br />
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            tickFormatter={(v) => formatMinutes(v)}
            label={{ value: 'Temps (min)', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            domain={['auto', 'auto']}
            label={{ value: 'Fréquence (Hz)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          {speakers.map((speaker, i) => (
            <Line
              key={speaker}
              data={pitchData[speaker]}
              dataKey="pitch"
              name={speaker}
              stroke={colors[i % colors.length]}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

        </Container>
  );
}
