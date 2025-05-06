// actions/updateApplicationStatus.js
"use server";

import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function updateApplicationStatus(applicationId, status) {
  try {
    const collection = await getCollection("gigApplications");
    if (!collection) {
      return {
        success: false,
        error: "Failed to connect to database",
      };
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return {
        success: false,
        error: "No application found with that ID",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    return {
      success: false,
      error: "An error occurred while updating the status",
    };
  }
}
