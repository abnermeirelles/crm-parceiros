import { Readable } from "node:stream";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPartnerPhoto } from "@/lib/s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key || !key.startsWith("parceiros/")) {
    return NextResponse.json({ error: "Foto inválida." }, { status: 400 });
  }

  try {
    const photo = await getPartnerPhoto(key);
    return new Response(Readable.toWeb(photo.stream) as ReadableStream, {
      headers: {
        "Content-Type": photo.contentType,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
  }
}
