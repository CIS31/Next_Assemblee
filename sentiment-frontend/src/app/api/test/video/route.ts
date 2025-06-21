import { BlobServiceClient } from '@azure/storage-blob';
import { NextRequest } from 'next/server';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const CONTAINER_NAME = 'data';
const BLOB_PATH = 'video/output/output_video_test.mp4';

export async function GET(req: NextRequest) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(BLOB_PATH);
  const downloadBlockBlobResponse = await blobClient.download();

  const stream = downloadBlockBlobResponse.readableStreamBody;

if (!stream) {
  return new Response('Video stream not available', { status: 500 });
}

return new Response(stream as unknown as BodyInit, {
  headers: {
    'Content-Type': 'video/mp4',
  },
});

}
