import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("equipmentRental");

export const auth = betterAuth({
  database: mongodbAdapter(db),
    database: mongodbAdapter(db),
  plugins: [jwt()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false,
      },
      phone: { type: "string", required: false },
      address: { type: "string", required: false },
    },
  },
});