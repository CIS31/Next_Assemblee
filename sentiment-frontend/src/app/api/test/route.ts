import { NextResponse, NextRequest } from 'next/server';
import { Client } from 'pg';
// import { BlobServiceClient } from '@azure/storage-blob';

// // Paramètres Azure Blob Storage
// const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
// const CONTAINER_NAME = 'data';
// const BLOB_PATH = 'video/output/output_video_test.mp4';

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
    // // 2. Connexion Azure Blob Storage
    // const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    // const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    // const blobClient = containerClient.getBlobClient(BLOB_PATH);
    // const downloadBlockBlobResponse = await blobClient.download();

    // const stream = downloadBlockBlobResponse.readableStreamBody;

    // // 3. Retourne les données en JSON + stream vidéo en header personnalisé
    // // Tu ne peux pas envoyer le stream vidéo **et** du JSON en même temps via la même réponse HTTP
    // // => On va retourner les données SQL et fournir un lien vers `/api/video` pour la vidéo

    // return NextResponse.json({
    //   data: res.rows,
    //   videoUrl: '/api/test/video', // à appeler depuis un <video src="...">
    // });

  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Erreur serveur', details: String(error) }, { status: 500 });
  }
}
