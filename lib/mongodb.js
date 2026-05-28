import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

// Build time এ connection skip করো
if (typeof window === "undefined") {
  if (!uri) {
    // Build time এ dummy promise দাও
    clientPromise = Promise.resolve(null);
  } else if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;

export async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not configured");
  }
  const c = await clientPromise;
  return c.db(process.env.MONGODB_DB);
}