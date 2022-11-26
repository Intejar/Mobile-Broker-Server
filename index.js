const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectID, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express();

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xk69pxb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// const verifyJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('unothorized user')
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' })
//         }
//         req.decoded = decoded
//         next()
//     })
// }

async function run() {
    try {
        const usersCollection = client.db('MobileBroker').collection('users')
        const productsCollection = client.db('MobileBroker').collection('products')
        const bookingsCollection = client.db('MobileBroker').collection('bookings')
        const wishListCollection = client.db('MobileBroker').collection('wishList')

        app.get('/users', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email };
            }
            if (req.query.role) {
                query = {role : req.query.role};
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email };
            }
            if (req.query.category) {
                query = {category : req.query.category};
            }
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productsCollection.findOne(query);
            console.log(result)
            res.send(result)
        })
        

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            console.log(result)
            res.send(result)
        })
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const edited = req.body.editedInfo
            console.log(edited)
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    productName: edited.productName,
                    resalePrice : edited.resalePrice,
                    description : edited.description
                }
            }
            const result = await productsCollection.updateOne(query, updatedDoc);
            /* res.send(result) */
            console.log(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req.query.customerEmail) {
                query = { customerEmail: req.query.customerEmail };
            }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/bookings', async(req,res)=>{
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking)
            console.log(result)
            res.send(result)
        })
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/wishlist', async (req, res) => {
            let query = {};
            if (req.query.customerEmail) {
                query = { customerEmail: req.query.customerEmail };
            }
            const result = await wishListCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/wishlist', async(req,res)=>{
            const wishList = req.body;
            const result = await wishListCollection.insertOne(wishList)
            console.log(result)
            res.send(result)
        })
        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await wishListCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/users/admin/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            console.log(user)
            res.send({isAdmin: user?.role === 'admin'})
        })

        app.patch('/users/admin/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = {upsert: true}
            const updatedDoc = {
                $set : {
                    role : 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/users/varify/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            console.log(user)
            res.send({isVarified: user?.userStatus === 'varified'})
        })
        app.put('/users/varify/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = {upsert: true}
            const updatedDoc = {
                $set : {
                    userStatus : 'varified'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        
        
    }

    finally {

    }

}
run().catch(console.log)


app.get('/', async (req, res) => {
    res.send('mobile broker server is running')
})

app.listen(port, () => console.log(`server is running on ${port}`))