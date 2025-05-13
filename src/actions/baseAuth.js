"use server";
import { getCollection } from "@/lib/db";

export async function registerWithBaseAuth(walletAddress) {
  const userCollection = await getCollection("users");
  if (!userCollection) {
    return { error: "Database connection failed" };
  }

  try {
    const baseId = walletAddress
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 10)
      .toLowerCase();

    const existingUser = await userCollection.findOne({
      walletAddress: walletAddress,
    });

    if (!existingUser) {
      const insertResult = await userCollection.insertOne({
        baseId,
        walletAddress,
        authMethod: "base",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!insertResult.acknowledged) {
        return { error: "Failed to create user" };
      }

      return {
        success: true,
        isNewUser: true,
        baseId,
      };
    }

    return {
      success: true,
      isNewUser: false,
      baseId: existingUser.baseId,
    };
  } catch (error) {
    console.error("Base registration error:", error);

    if (error.code === 11000 || error.message.includes("duplicate key")) {
      return { success: true, isNewUser: false };
    }

    return { error: error.message || "Registration failed. Please try again." };
  }
}
