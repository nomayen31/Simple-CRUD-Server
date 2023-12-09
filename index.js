const express = require('express');
var cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware 
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://admin:admin@cluster0.07lgbsy.mongodb.net/?retryWrites=true&w=majority";

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

    // const database = client.db("usersDB");
    // const userCollection = database.collection("users");
    const database = client.db("usersDB");
    const userCollection = database.collection("users");


    app.get('/users',async (req, res)=>{
      const cursor = userCollection.find()
      const result = await  cursor.toArray();
      res.send(result)

    })


    app.post('/users', async (req, res) => {
      console.log('user server');
      const user = req.body;
      console.log('new user', user);
      const result = await userCollection.insertOne(user);
      res.send(result)
      console.log(`A document was inserted with the _id: ${result.insertedId}`);  
    })
    
    app.delete('/users/:id',async(req, res)=>{
      const id = req.params.id;
      console.log('pls delete form DB',id)
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query)
      res.send(result)
      

    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('  SIMPLE CURD IS RUNNING')
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})