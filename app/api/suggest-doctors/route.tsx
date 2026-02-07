import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json()
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        { role: 'system', content: JSON.stringify(AIDoctorAgents) },
        { role: "user", content: "User Notes/Symptoms:" + notes + ". Based on the symptoms, identify the two most relevant doctors from the provided list. Return ONLY a JSON array containing the numeric IDs of the two doctors. One should be 'General Physician' (ID: 1). If there is no specialist doctor for the symptom, identify 'General Physician' only. As  Example response: [1, 7]" }
      ],
    })

    const rawResp = completion.choices[0].message;
    //@ts-ignore
    const Resp = rawResp && rawResp.content.trim().replace('```json', '').replace('```', '');
    let JSONResp = JSON.parse(Resp);

    let suggestedIds: number[] = [];

    // Normalize to array
    let idArray: any[] = [];
    if (Array.isArray(JSONResp)) {
      idArray = JSONResp;
    } else if (JSONResp && typeof JSONResp === 'object') {
      idArray = JSONResp.doctors || JSONResp.data || JSONResp.ids || [];
    }

    // Extract numbers safely
    suggestedIds = idArray.map((item: any) => {
      if (typeof item === 'number') return item;
      if (typeof item === 'string') return parseInt(item);
      if (item && typeof item === 'object' && (item.id || item.Data)) { // Handle { id: 1 } or similar
        const val = item.id || item.Data;
        return typeof val === 'string' ? parseInt(val) : val;
      }
      return null;
    }).filter((id): id is number => id !== null && !isNaN(id));

    // Filter the full list to get the actual doctor objects
    const finalDoctors = AIDoctorAgents.filter(doctor => suggestedIds.includes(doctor.id));

    // Fallback: If no doctors found or parsing failed, return General Physician (ID 1)
    if (finalDoctors.length === 0) {
      const generalPhysician = AIDoctorAgents.find(doc => doc.id === 1);
      if (generalPhysician) finalDoctors.push(generalPhysician);
    }

    return NextResponse.json(finalDoctors);

  } catch (e) {
    return NextResponse.json(e);
  }
}