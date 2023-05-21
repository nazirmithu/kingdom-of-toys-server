const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbxlkz1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db('kingdomOfToysDB').collection('toys');


    const indexToys = { toyName: 1 }
    const indexToysOptions = { name: "toyName" }

    const result = await toysCollection.createIndex(indexToys, indexToysOptions)

    app.get('/toysearch/:text', async (req, res) => {
      const toySearch = req.params.text;
      const result = await toysCollection.find({
        $or: [
          { toyName: { $regex: toySearch, $options: 'i' } }
        ]
      }).toArray();

      console.log(result)
      res.send(result)
    })

    app.post('/addtoys', async (req, res) => {
      const newToy = req.body;
      console.log(newToy)
      const result = await toysCollection.insertOne(newToy);
      res.send(result);
    });

    app.get('/reacttabs', async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result)
    });

    app.get('/alltoys', async (req, res) => {
      const result = await toysCollection.find().limit(20).toArray();
      res.send(result)
    });

    app.get('/mytoys/:email', async (req, res) => {
      console.log(req.params.email)
      const result = await toysCollection.find({
        seller_email: req.params.email
      }).toArray();
      res.send(result)
    })

    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query);
      res.send(result);
    })

    app.patch('/alltoys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const newUpdatedToy = req.body;
      const updatedToy = {
        $set: {
          price: newUpdatedToy.price,
          quantity: newUpdatedToy.quantity,
          description: newUpdatedToy.description
        }
      }
      const result = await toysCollection.updateOne(filter, options, updatedToy)
      res.send(result)
    })

    app.delete('/mytoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('kingdom of joys server is running')
})

app.listen(port, () => {
  console.log(`kingdom server is running on port:${port}`)
})