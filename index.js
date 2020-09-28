const express = require('express');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = 'V3FdPtZAe4iCDaRl';


const uri = "mongodb://MohammedDb:V3FdPtZAe4iCDaRl@cluster0-shard-00-00.18zpv.mongodb.net:27017,cluster0-shard-00-01.18zpv.mongodb.net:27017,cluster0-shard-00-02.18zpv.mongodb.net:27017/Organicdb?ssl=true&replicaSet=atlas-m09ury-shard-0&authSource=admin&retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})





// MongoClient.connect(uri, function(err, client) {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true  });

client.connect(err => {
  const productCollection = client.db("Organicdb").collection("products");
 

  app.get('/products', (req, res) => {
   productCollection.find({})
   .toArray((err, documents) => {
     res.send(documents)
   })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })


 app.post("/addProduct", (req, res) =>{
   const product = req.body;
   productCollection.insertOne(product)
   .then(result => {
     console.log('data added successfully');
     res.redirect('/');
   })
 })
  // perform actions on the collection object

   app.patch('/update/:id', (req, res) =>{
     console.log(req.params.price);
     productCollection.updateOne({_id: ObjectId( req.params.id)}, 
     {
       $set: {price:req.body.price, quantity: req.body.quantity}
     })
     .then(result => {
      res.send(result.modifiedCount > 0);
     })
   })

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId( req.params.id)})
    .then(result =>{
       res.send (result.deletedCount > 0);
    })
  })
  
});


app.listen(3001);