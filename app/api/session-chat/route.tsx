import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { SessionChatTable } from "@/config/schema";
import { uuid } from 'uuidv4';
import { AIDoctorAgents } from "@/shared/list";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = uuid();

    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId,
        createdBy: user.primaryEmailAddress?.emailAddress,
        notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const user = await currentUser();

  const result = await db.select().from(SessionChatTable)
    //@ts-ignore
    .where(eq(SessionChatTable.sessionId, sessionId));

  const session = result[0];

  // Hydrate selectedDoctor if image is missing
  if (session && session.selectedDoctor) {
    const doc = session.selectedDoctor as any;
    // If doc is just an ID or missing image
    if (!doc.image || typeof doc === 'number') {
      const docId = typeof doc === 'number' ? doc : doc.id;
      const fullDoc = AIDoctorAgents.find(d => d.id === Number(docId));
      if (fullDoc) {
        session.selectedDoctor = fullDoc;
      }
    }
  }

  return NextResponse.json(session);
}

