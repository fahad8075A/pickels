import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET || "assets";
const endpoint = process.env.S3_ENDPOINT;
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true" || !!endpoint;

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const config: any = {
      region,
      forcePathStyle,
    };

    if (endpoint) {
      config.endpoint = endpoint;
    }

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    s3ClientInstance = new S3Client(config);
  }
  return s3ClientInstance;
}

export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; bucket: string }> {
  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);
  return { key, bucket };
}

export async function getS3DownloadSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const s3 = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_REGION || process.env.S3_ENDPOINT)
  );
}
