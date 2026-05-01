const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

const { getFirebaseAdminApp } = require("./config/firebaseAdmin");

try {
  // Initialize Firebase Admin, but do not let initialization errors crash the module
  // in serverless environments. Missing/invalid env vars will be logged instead.
  getFirebaseAdminApp();
} catch (err) {
  console.error(
    "Firebase initialization warning:",
    err && err.message ? err.message : err,
  );
}

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "MONGODB_URI is missing. Check your .env file or deployment variables.",
  );
}
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Verify Firebase Admin configuration at startup
app.get("/", (req, res) => {
  res.send("Welcome TO the Travel Guru!");
});

let collectionsPromise;

// email
// "admin@travelagency.com"
// password
// "$2b$10$hashed_password_here"

async function getCollections() {
  if (!collectionsPromise) {
    collectionsPromise = client
      .connect()
      .then(async () => {
        const db = client.db("travelGuru");
        // await client.db("admin").command({ ping: 1 });
        console.log(
          "Pinged your deployment. You successfully connected to MongoDB!",
        );
        return {
          packagesCollection: db.collection("packages"),
          bookingCollection: db.collection("bookings"),
          userCollection: db.collection("users"),
          blogCollection: db.collection("blogs"),
        };
      })
      .catch((error) => {
        collectionsPromise = null;
        throw error;
      });
  }

  return collectionsPromise;
}

const withCollections = (handler) => async (req, res) => {
  try {
    const collections = await getCollections();
    await handler(req, res, collections);
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Database unavailable" });
  }
};

// Define API endpoints for packages
app.post(
  "/packages",
  withCollections(async (req, res, { packagesCollection }) => {
    const newPackage = { ...req.body, _id: new ObjectId() };
    const result = await packagesCollection.insertOne(newPackage);
    res.send(result);
  }),
);

app.get(
  "/packages",
  withCollections(async (req, res, { packagesCollection }) => {
    const cursor = packagesCollection.find({});
    const packages = await cursor.toArray();
    res.send(packages);
  }),
);

app.get(
  "/packages/:id",
  withCollections(async (req, res, { packagesCollection }) => {
    //console.log('headers', req.headers);
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await packagesCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.delete(
  "/packages/:id",
  withCollections(async (req, res, { packagesCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await packagesCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.patch(
  "/packages/:id",
  withCollections(async (req, res, { packagesCollection }) => {
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
  }),
);

//api for booking
app.post(
  "/bookings",
  withCollections(async (req, res, { bookingCollection }) => {
    const newBooking = { ...req.body, _id: new ObjectId() };
    const result = await bookingCollection.insertOne(newBooking);
    res.send(result);
  }),
);

app.get(
  "/bookings",
  withCollections(async (req, res, { bookingCollection }) => {
    const cursor = bookingCollection.find({});
    const bookings = await cursor.toArray();
    res.send(bookings);
  }),
);

app.get(
  "/bookings/:id",
  withCollections(async (req, res, { bookingCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await bookingCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.delete(
  "/bookings/:id",
  withCollections(async (req, res, { bookingCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await bookingCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.patch(
  "/bookings/:id",
  withCollections(async (req, res, { bookingCollection }) => {
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
  }),
);

//api for user
app.post(
  "/users",
  withCollections(async (req, res, { userCollection }) => {
    const newUser = { ...req.body, _id: new ObjectId() };
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  }),
);

app.get(
  "/users",
  withCollections(async (req, res, { userCollection }) => {
    const cursor = userCollection.find({});
    const users = await cursor.toArray();
    res.send(users);
  }),
);

app.get(
  "/users/:id",
  withCollections(async (req, res, { userCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await userCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.delete(
  "/users/:id",
  withCollections(async (req, res, { userCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.patch(
  "/users/:id",
  withCollections(async (req, res, { userCollection }) => {
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
  }),
);
app.put(
  "/users/:id",
  withCollections(async (req, res, { userCollection }) => {
    const id = req.params.id;
    const updatedUser = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser },
      { upsert: true },
    );
    res.send(result);
  }),
);

//api for blogs
app.post(
  "/blogs",
  withCollections(async (req, res, { blogCollection }) => {
    const newBlog = { ...req.body, _id: new ObjectId() };
    const result = await blogCollection.insertOne(newBlog);
    res.send(result);
  }),
);

app.get(
  "/blogs",
  withCollections(async (req, res, { blogCollection }) => {
    const cursor = blogCollection.find({});
    const blogs = await cursor.toArray();
    res.send(blogs);
  }),
);

app.get(
  "/blogs/:id",
  withCollections(async (req, res, { blogCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await blogCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.delete(
  "/blogs/:id",
  withCollections(async (req, res, { blogCollection }) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  }),
);

app.patch(
  "/blogs/:id",
  withCollections(async (req, res, { blogCollection }) => {
    const id = req.params.id;
    const updatedBlog = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBlog },
    );
    res.send(result);
  }),
);

if (require.main === module && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;
