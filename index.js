const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.na7oygr.mongodb.net/?retryWrites=true&w=majority`;

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
    const dreamExplorerCollection = client.db("dreamExplorerDb").collection('Services');
    const galleryCollection = client.db('dreamExplorerDb').collection('Gallery');
    const ordersCollection = client.db('dreamExplorerDb').collection('orders');
    

    app.get('/services', async(req, res) =>{
        const query = {};
        const cursor = dreamExplorerCollection.find(query);
        const services =await cursor.toArray();
        res.send(services);
    });

    app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const service = await dreamExplorerCollection.findOne(query);
        res.send(service);
    });
    app.post('/services', async(req, res) =>{
        const service = req.body;
        const result = await dreamExplorerCollection.insertOne(service);
        res.send(result);
    })
    app.get('/gallery', async(req, res) =>{
      const query = {};
      const cursor = galleryCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);      
    })
    app.get('/allorders', async(req, res) =>{
        const query = {};
        const cursor = ordersCollection.find(query);
        const result =await cursor.toArray();
        res.send(result);
    })
    app.get('/orders', async(req, res) =>{
        const queryEmail = req.query.email;
        const query = {
            email: queryEmail
        }
        const cursor = ordersCollection.find(query);
        const result = await cursor.toArray(); 
        res.send(result);
    })
    app.post('/orders', async(req, res) =>{
        const orders = req.body;
        const result =await ordersCollection.insertOne(orders);
        res.send(result);
    })
    app.patch('/orders/:id', async(req, res) =>{
        const id = req.params.id;
        const status = req.body.status;
        const updateOne ={
          $set: {
            status: status
          }
        }
        const query = {_id: new ObjectId(id)};
        const result =await ordersCollection.updateOne(query, updateOne);
        res.send(result);
    })
    app.delete('/orders/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result =await ordersCollection.deleteOne(query);
        res.send(result);
    })
   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.use('/', (req, res) =>{
    res.send('Dream Explorer running')
})

app.listen(port, ()=>{
    console.log(`Dream Explorer is running ${port}`);
})