import { createGig } from "@/actions/createGig";
import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createGig(body);

    if (!result.success) {
      return NextResponse.json({ error: result.errors }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job created successfully",
        jobId: result.gigId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const collection = await getCollection("gigs");
    if (!collection) {
      throw new Error("Database connection failed");
    }

    const jobs = await collection.find({}).toArray();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
