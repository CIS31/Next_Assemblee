import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Gantt
    const ganttRes = await client.query(`
      SELECT speaker_label, start, duration
      FROM public.audio_timeline_prise_parole
      WHERE file_id = 'input2'
      ORDER BY speaker_label, start
    `);

    const gantt = ganttRes.rows.map((row) => ({
      speaker: row.speaker_label,
      start: parseFloat(row.start),
      duration: parseFloat(row.duration),
    }));

    // Intensity
    const intensityRes = await client.query(`
      SELECT speaker_label,
             ROUND(temps_s * 2) / 2 AS time,
             AVG(intensity_db) AS avg_db
      FROM public.audio_timeline_intensity
      WHERE file_id = 'input2'
      GROUP BY speaker_label, time
      ORDER BY speaker_label, time
    `);

    const intensity = intensityRes.rows.map((row) => ({
      speaker: row.speaker_label,
      time: parseFloat(row.time),
      intensity: parseFloat(row.avg_db),
    }));

    // Pitch (Hz)
    const pitchRes = await client.query(`
      SELECT speaker_label,
             ROUND(temps_s * 2) / 2 AS time,
             AVG(pitch_hz) AS avg_pitch
      FROM public.audio_timeline_pitch
      WHERE file_audio = 'input2'
      GROUP BY speaker_label, time
      ORDER BY speaker_label, time
    `);

    const pitch = pitchRes.rows.map((row) => ({
      speaker: row.speaker_label,
      time: parseFloat(row.time),
      pitch: parseFloat(row.avg_pitch),
    }));

    await client.end();

    return NextResponse.json({ gantt, intensity, pitch });
  } catch (error) {
    console.error('Erreur PostgreSQL:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
