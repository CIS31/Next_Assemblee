// /app/api/test/texttimeline/route.ts
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // 1. Requête principale : lignes textuelles
    const lignesRes = await client.query(`
      SELECT * FROM texttimeline 
      WHERE docid = (SELECT MAX(docid) FROM texttimeline) 
      ORDER BY debut
    `);

    // 2. Requête secondaire : émotions par minute
    const emotionsRes = await client.query(`
      WITH emotion_par_ligne AS (
        SELECT
          debut,
          fin,
          emotions[i] AS emotion_dominante,
          valeurs[i] AS valeur_max
        FROM (
          SELECT
            debut,
            fin,
            ARRAY['sad', 'disgust', 'angry', 'neutral', 'fear', 'surprise', 'happy'] AS emotions,
            ARRAY[sad, disgust, angry, neutral, fear, surprise, happy] AS valeurs
          FROM
            public.texttimeline
          WHERE
            docid = (SELECT MAX(docid) FROM texttimeline)
        ) t,
        LATERAL (
          SELECT i
          FROM generate_subscripts(valeurs, 1) AS i
          ORDER BY valeurs[i] DESC
          LIMIT 1
        ) idx
      ),
      emotion_par_minute AS (
        SELECT
          FLOOR(debut / 60)::int AS minute,
          emotion_dominante
        FROM emotion_par_ligne
      )
      SELECT
        minute,
        emotion_dominante,
        COUNT(*) AS occurrences
      FROM emotion_par_minute
      GROUP BY minute, emotion_dominante
      ORDER BY minute, occurrences DESC;
    `);

    await client.end();

    return NextResponse.json({
      lignes: lignesRes.rows,
      emotions: emotionsRes.rows,
    });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
