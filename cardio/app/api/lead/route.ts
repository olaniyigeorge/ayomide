import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/db/mongodb";
import Lead from "@/db/leads.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const goals = Array.isArray(body?.goals) ? body.goals : [];

    if (!name || !phone || goals.length === 0) {
      return NextResponse.json(
        { error: "Name, phone, and at least one goal are required." },
        { status: 400 }
      );
    }

    await connectToDB();
    const lead = await Lead.create({ name, phone, goals });

    return NextResponse.json({ success: true, id: lead._id }, { status: 201 });
  } catch (error) {
    console.error("Error saving intake submission:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}