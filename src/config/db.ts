import mongoose from "mongoose";

let isConnected = false;

export default async function connectToDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(
      `${process.env.MONGO_URI as string}/glaroma_ecommerce`,
    );
    isConnected = true;
    console.log("connected to Database");
  } catch (error) {
    console.log(error);
  }
}
