const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "travelGuru";

if (!uri) {
  throw new Error("Missing MONGODB_URI. Add it to your .env file.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Welcome TO the Travel Guru!");
});

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const packageCollection = db.collection("package");

    // All API is here
    app.post("/packages", async (req, res) => {
      const newPackage = req.body;
      const result = await packageCollection.insertOne(newPackage);
      res.send(result);
    });

    app.get("/packages", async (req, res) => {
      const result = await packageCollection.find().toArray();
      res.send(result);
    });

    //avobe all re API
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
