const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 4000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

//mongodbapi
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfyyfuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);
//mongodb try function start---
async function run() {
  try {
    const studentCollection = client.db("StudentApp").collection("students");

    // Add Student
    app.post("/add-student", async (req, res) => {
      const student = req.body;

      const result = await studentCollection.insertOne(student);
      res.send(result);
    });

    // get all students
    app.get("/students", async (req, res) => {
      const query = {};
      const cursor = studentCollection.find(query).sort({ roll: 1 });
      const students = await cursor.toArray();
      res.send(students);
    });

    // get student by id
    app.get("/view/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentCollection.findOne(query);
      res.send(result);
    });

    // edit student by id
    app.put("/edit/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = req.body;
      const option = { upsert: true };
      const updateStudent = {
        $set: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          class: data.class,
          division: data.division,
          roll: data.roll,
          adress1: data.adress1,
          adress2: data.adress2,
          landmark: data.landmark,
          city: data.city,
          pincode: data.pincode,
          profile_pic: data.profile_pic,
        },
      };
      const result = await studentCollection.updateOne(
        filter,
        updateStudent,
        option
      );
      res.send(result);
    });

    // delete student by id
    app.post("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));
// Express
app.listen(port, () => {
  console.log("Server running on port", port);
});

app.get("/", (req, res) => {
  res.send("Server Running");
});
