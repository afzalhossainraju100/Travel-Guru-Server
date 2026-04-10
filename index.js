const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://travelGuru:o7StOuUYVwd4bkHK@cluster0.1ezipje.mongodb.net/?appName=Cluster0";
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
    const db = client.db("travelGuru");
    const packagesCollection = db.collection("packages");
    const bookingCollection = db.collection("bookings");
    const userCollection = db.collection("users");
    // Define API endpoints for packages
    app.post("/packages", async (req, res) => {
      const newPackage = { ...req.body, _id: new ObjectId() };
      const result = await packagesCollection.insertOne(newPackage);
      res.send(result);
    });

    app.get("/packages", async (req, res) => {
      const cursor = packagesCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await packagesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.delete("/packages/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await packagesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.patch("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPackage = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await packagesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPackage },
      );
      res.send(result);
    });

    //api for booking
    app.post("/bookings", async (req, res) => {
      const newBooking = { ...req.body, _id: new ObjectId() };
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await bookingCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await bookingCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedBooking },
      );
      res.send(result);
    });
    //api for user
    app.post("/users", async (req, res) => {
      const newUser = { ...req.body, _id: new ObjectId() };
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await userCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await userCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid id" });
      }

      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
      );
      res.send(result);
    });

    //End of API endpoints for packages
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
