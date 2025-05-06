"use server";

import { getCollection } from "@/lib/db";
import gigSchema from "@/lib/CreateGig";

export async function createGig(formData) {
  try {
    const validatedData = gigSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const collection = await getCollection("gigs");
    if (!collection) {
      return {
        success: false,
        errors: { database: "Failed to connect to database" },
      };
    }

    const result = await collection.insertOne({
      ...validatedData.data,
      createdAt: new Date(),
      status: "active",
    });

    return {
      success: true,
      gigId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Error creating gig:", error);
    return {
      success: false,
      errors: { database: "Failed to create gig" },
    };
  }
}
