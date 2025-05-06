"use server";

import { getCollection } from "@/lib/db";
import { applicationSchema } from "@/lib/JobApplication";

export async function applyToGig(formData) {
  try {
    const services = [];
    let serviceIndex = 0;
    while (formData.has(`services[${serviceIndex}]`)) {
      services.push(formData.get(`services[${serviceIndex}]`));
      serviceIndex++;
    }

    const milestones = [];
    let milestoneIndex = 0;
    while (formData.has(`milestones[${milestoneIndex}].header`)) {
      milestones.push({
        header: formData.get(`milestones[${milestoneIndex}].header`),
        body: formData.get(`milestones[${milestoneIndex}].body`),
        date: formData.get(`milestones[${milestoneIndex}].date`),
      });
      milestoneIndex++;
    }

    const rawData = {
      name: formData.get("name"),
      applicationText: formData.get("applicationText"),
      portfolioLink: formData.get("portfolioLink"),
      jobTitle: formData.get("jobTitle"),
      jobDescription: formData.get("jobDescription"),
      userId: formData.get("userId"),
      applicantId: formData.get("applicantId"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      paymentAmount: formData.get("paymentAmount"),
      paymentToken: formData.get("paymentToken"),
      services,
      milestones,
    };

    const validated = applicationSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const collection = await getCollection("gigApplications");
    if (!collection) {
      return {
        success: false,
        errors: { database: "Failed to connect to database" },
      };
    }

    const insertResult = await collection.insertOne({
      ...validated.data,
      createdAt: new Date(),
      status: "submitted",
    });

    return {
      success: true,
      applicationId: insertResult.insertedId.toString(),
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return {
      success: false,
      errors: {
        database: "An error occurred while submitting your application.",
      },
    };
  }
}
