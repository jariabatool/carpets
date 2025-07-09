// scripts/addVariants.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const uri = "mongodb+srv://Marble:marbleapp@cluster0.srd57ej.mongodb.net/marble-app?retryWrites=true&w=majority"; // e.g., "mongodb://localhost:27017/your-db"
if (!uri) {
  console.error("❌ MONGO_URL not found in .env file.");
  process.exit(1);
}

const carpetSchema = new mongoose.Schema({}, { strict: false });
const Carpet = mongoose.model("Carpet", carpetSchema);

const variantsToAdd = [
  { color: "Green", size: "4x6", price: 120, quantity: 6 },
  { color: "Beige", size: "5x8", price: 160, quantity: 3 }
];

async function addVariantsToAllCarpets() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const result = await Carpet.updateMany(
      { variant: { $exists: false } }, // Add only if not present
      { $set: { variant: variantsToAdd } }
    );

    console.log(`✅ ${result.modifiedCount} carpets updated with variant data.`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating variants:", err);
    mongoose.disconnect();
  }
}

addVariantsToAllCarpets();
