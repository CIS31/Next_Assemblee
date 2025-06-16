// import { NextResponse } from 'next/server'

// export async function GET() {
//   return NextResponse.json({ message: 'Hello from API (Next.js App Router)' })
// }

import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM test');
    await client.end();

    return NextResponse.json({ data: res.rows });
  } catch (error) {
    console.error('DB Error:', error);

    return NextResponse.json({ error: 'Erreur lors de la requête à la base de données' }, { status: 500 });
  }
}
