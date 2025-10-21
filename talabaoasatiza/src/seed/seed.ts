import dotenv from "dotenv";
dotenv.config();
import { ClassModel } from "../models/Class.js";
import connectToDatabase from "../config/db/db.js";

const classes = [
  "عامہ سال اول","عامہ سال دوم","خاصہ سال اول","خاصہ سال دوم",
  "عالیہ سال اول","عالیہ سال دوم","عالمیہ سال اول","عالمیہ سال دوم"
];

async function run() {
  await connectToDatabase();
  for (const name of classes) {
    await ClassModel.updateOne({ name }, { name }, { upsert: true });
    console.log("ensured class:", name);
  }
  console.log("Seed complete");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
