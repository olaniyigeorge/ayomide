import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/db/mongodb";
import CheckIn from "@/db/checkin.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const weight = Number(body?.weight);
    const waist = Number(body?.waist);
    const glute = Number(body?.glute);
    const note = String(body?.note ?? "").trim();

    if (!weight || !waist || !glute) {
      return NextResponse.json(
        { error: "Weight, waist, and glute measurements are required." },
        { status: 400 }
      );
    }

    await connectToDB();
    const entry = await CheckIn.create({ weight, waist, glute, note });

    return NextResponse.json({ success: true, id: entry._id }, { status: 201 });
  } catch (error) {
    console.error("Error saving check-in:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();
    const entries = await CheckIn.find().sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}