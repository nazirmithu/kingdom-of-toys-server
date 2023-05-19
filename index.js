const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// kingdomOfToys
// AzsJBGZ6OBPexPgo



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
    await client.connect();

    const toysCollection = client.db('kingdomOfToysDB').collection('toys');


    app.post('/addtoys', async(req, res)=>{
      const newToy = req.body;
      console.log(newToy)
      const result = await toysCollection.insertOne(newToy);
      res.send(result);
    });

    app.get('/alltoys', async(req, res)=>{
      const result = await toysCollection.find().toArray();
      res.send(result)
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



app.use(cors());
app.use(express.json());


app.get('/', (req,res)=>{
    res.send('kingdom of joys server is running')
})



app.listen(port,()=>{
    console.log(`kingdom server is running on port:${port}`)
})