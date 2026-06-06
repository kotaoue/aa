import { NextResponse } from "next/server";
import { getArtifactCollection, getFirestoreDb } from "@/lib/firestore/client";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;

  try {
    const db = getFirestoreDb();
    const doc = await db.collection(getArtifactCollection()).doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = doc.data();
    const svg = data?.svg;

    if (typeof svg !== "string") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new Response(svg, {
      status: 200,
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch artifact" }, { status: 500 });
  }
}
