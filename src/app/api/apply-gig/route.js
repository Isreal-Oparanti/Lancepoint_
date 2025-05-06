import { NextResponse } from "next/server";
import { applyToGig } from "@/actions/applyToGig";
import { getCollection } from "@/lib/db";
import { updateApplicationStatus } from "@/actions/updateApplicationStatus";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await applyToGig(formData);

    if (!result.success) {
      return NextResponse.json({ error: result.errors }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: result.applicationId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const collection = await getCollection("gigApplications");
    if (!collection) {
      throw new Error("Database connection failed");
    }

    const applications = await collection.find({}).toArray();
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { applicationId, status } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "applicationId and status are required" },
        { status: 400 }
      );
    }

    const result = await updateApplicationStatus(applicationId, status);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
