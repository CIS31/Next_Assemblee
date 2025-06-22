import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const res = await client.query(
      'SELECT * FROM texttimeline where  docid = (SELECT MAX(docid) FROM texttimeline) order by debut'
    );

    await client.end();
    return NextResponse.json({ data: res.rows });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
