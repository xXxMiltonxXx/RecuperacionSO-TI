// Grupo #8
//Campuzano Espinal Daiton Bernardo
// Grupo #1
// Alejandro Bueno Peralta


const express = require("express");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
  await client.connect();
  console.log("Connected successfully to MongoDB");
  const db = client.db("library");
  const collection = db.collection("books");

  // Mostrar todos los libros
  app.get("/books", async (req, res) => {
    const books = await collection.find({}).toArray();
    res.send(books);
  });

  // Añadir un libro
  app.post("/addBook", async (req, res) => {
    const { title, author, genre, year } = req.body;
    if (!title || !author || !genre || !year) {
      return res.status(400).send({ error: "All fields are required" });
    }
    await collection.insertOne({ title, author, genre, year });
    res.send({ success: true });
  });

  // Actualizar información de un libro
  app.put("/updateBook", async (req, res) => {
    const { title, author, genre, year } = req.body;
    if (!title || !author || !genre || !year) {
      return res.status(400).send({ error: "All fields are required" });
    }
    await collection.updateOne(
      { title },
      { $set: { author, genre, year } }
    );
    res.send({ success: true });
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

main().catch(console.error);
