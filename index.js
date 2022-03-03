const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('admins'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5xmh9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("db connected");
    console.log(err);
  const productsCollection = client.db("partmasterdirect").collection("allProducts");
  const carModelCollection = client.db("partmasterdirect").collection("carModels");
  const categoryCollection = client.db("partmasterdirect").collection("categories");

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})
app.post('/addCarModel', (req, res) => {
    const product = req.body;
    carModelCollection.insertOne(product)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})
app.post('/addCategory', (req, res) => {
  const category = req.body;
  categoryCollection.insertOne(category)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
})
app.get('/allProduct', (req, res) => {
    productsCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
})
app.get('/productByType', (req, res) => {
  productsCollection.find({ type: req.query.type})
      .toArray((err, items) => {
          res.send(items)
      })
})
app.get('/allCarModel', (req, res) => {
    carModelCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
})
app.get('/carMake', (req, res) => {
  carModelCollection.find({ make: req.query.make})
      .toArray((err, items) => {
          res.send(items)
      })
})
app.get('/allCategory', (req, res) => {
  categoryCollection.find()
      .toArray((err, items) => {
          res.send(items)
      })
})
app.get('/categoryByType', (req, res) => {
  categoryCollection.find({ type: req.query.type})
      .toArray((err, items) => {
          res.send(items)
      })
})
app.patch('/update/:id', (req, res) => {
    productsCollection.updateOne({_id: ObjectID(req.params.id)},
    {
      $set: {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.body.image,
        description: req.body.description,
        unit: req.body.unit,
        salePrice: req.body.salePrice,
        carModel: req.body.carModel,
        discountInPercent: req.body.discountInPercent,
        type: req.body.type,
        slug: req.body.slug

        }
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })
  app.delete('/deleteProduct/:id', (req, res) =>{
    console.log(req.params.id)
    productsCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })
  app.delete('/deleteCategory/:id', (req, res) =>{
    console.log(req.params.id)
    categoryCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })
  app.delete('/deleteCarModel/:id', (req, res) =>{
    console.log(req.params.id)
    carModelCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })
  // perform actions on the collection object
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});