import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { SessionChatTable } from "@/config/schema";
import { uuid } from 'uuidv4';
import { AIDoctorAgents } from "@/shared/list";
import { desc, eq } from "drizzle-orm";

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

  if(sessionId === 'all')
  {
const result = await db.select().from(SessionChatTable)
    //@ts-ignore
    .where(eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(SessionChatTable.id));

    return NextResponse.json(result);
  }
  else{
    

  

 const result = await db.select().from(SessionChatTable)
 //@ts-ignore
.where(eq(SessionChatTable.sessionId, sessionId));

  return NextResponse.json(result[0]);
  }
  
}

