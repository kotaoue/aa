import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtifactCollection, getFirestoreDb } from "@/lib/firestore/client";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ArtifactPage({ params }: Params) {
  const { id } = await params;

  let svgExists = false;

  try {
    const db = getFirestoreDb();
    const doc = await db.collection(getArtifactCollection()).doc(id).get();

    if (!doc.exists) {
      notFound();
    }

    const data = doc.data();
    if (!data || typeof data.svg !== "string") {
      notFound();
    }
    svgExists = true;
  } catch {
    notFound();
  }

  if (!svgExists) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <h1 className="text-xl font-semibold">aa2svg</h1>
      <p className="text-sm text-zinc-600">Permalink: /a/{id}</p>
      <Image
        src={`/api/svg/${id}`}
        alt="AA preview"
        className="max-w-full border border-zinc-200"
        width={1200}
        height={600}
        unoptimized
      />
    </main>
  );
}
