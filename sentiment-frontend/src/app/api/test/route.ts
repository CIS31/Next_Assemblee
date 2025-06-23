import { NextResponse, NextRequest } from 'next/server';
import { Client } from 'pg';
// import { BlobServiceClient } from '@azure/storage-blob';

export async function GET() { //dans le get req: NextRequest
  // 1. Connexion PostgreSQL
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
const res = await client.query(
  "SELECT (second / 60) * 60 +60 AS minute_group, (regexp_matches(emotions, '^([a-zA-Z]+)\\(', 'g'))[1] AS emotion, COUNT(*) AS count FROM videotimeline WHERE emotions IS NOT NULL and videoid = (SELECT MAX(videoid) FROM videotimeline) AND emotions ~ '^[a-zA-Z]+\\(' GROUP BY minute_group, emotion ORDER BY minute_group, count DESC ;"
);
await client.end();

    return NextResponse.json({ data: res.rows });

  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Erreur serveur', details: String(error) }, { status: 500 });
  }
}
