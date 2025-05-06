"use server";
import { getCollection } from "@/lib/db";

export async function registerWithZKLogin(zksub, walletAddress) {
  const userCollection = await getCollection("users");
  if (!userCollection) {
    return { error: "Database connection failed" };
  }

  try {
    const existingUser = await userCollection.findOne({
      $or: [{ zksub }, { walletAddress }],
    });

    if (!existingUser) {
      const insertResult = await userCollection.insertOne({
        zksub,
        walletAddress,
        authMethod: "zklogin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!insertResult.acknowledged) {
        return { error: "Failed to create user" };
      }

      return { success: true, isNewUser: true };
    }

    return { success: true, isNewUser: false };
  } catch (error) {
    console.error("ZK registration error:", error);

    if (error.code === 11000 || error.message.includes("duplicate key")) {
      return { success: true, isNewUser: false };
    }

    return { error: error.message || "Registration failed. Please try again." };
  }
}
