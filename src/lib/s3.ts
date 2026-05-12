import { randomUUID } from "crypto";
import * as Minio from "minio";

function s3Config() {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;

  if (!endpoint || !bucket || !accessKey || !secretKey) {
    throw new Error("Configuração S3/MinIO incompleta.");
  }

  return {
    endpoint,
    bucket,
    accessKey,
    secretKey,
    port: Number(process.env.S3_PORT ?? 9000),
    useSSL: process.env.S3_USE_SSL === "true",
  };
}

function client() {
  const config = s3Config();
  return new Minio.Client({
    endPoint: config.endpoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  });
}

export async function uploadPartnerPhoto(file: File) {
  if (!file.size) return null;
  if (!file.type.startsWith("image/")) {
    throw new Error("A foto precisa ser um arquivo de imagem.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("A foto deve ter no máximo 5MB.");
  }

  const config = s3Config();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `parceiros/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const minio = client();

  const exists = await minio.bucketExists(config.bucket).catch(() => null);
  if (exists === false) {
    await minio.makeBucket(config.bucket, process.env.S3_REGION || "us-east-1");
  }

  await minio.putObject(config.bucket, key, buffer, buffer.length, {
    "Content-Type": file.type,
  });

  const publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL ||
    `${config.useSSL ? "https" : "http"}://${config.endpoint}:${config.port}/${config.bucket}`;

  return {
    key,
    url: `${publicBaseUrl.replace(/\/$/, "")}/${key}`,
  };
}

export async function getPartnerPhoto(key: string) {
  const config = s3Config();
  const minio = client();
  const [stat, stream] = await Promise.all([
    minio.statObject(config.bucket, key),
    minio.getObject(config.bucket, key),
  ]);

  return {
    stream,
    contentType: stat.metaData?.["content-type"] || "image/jpeg",
  };
}
