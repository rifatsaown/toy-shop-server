const express = require('express');
const app = express();
// Use dotenv to read .env vars into Node
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
// Mongo DB connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.meus3dj.mongodb.net/?retryWrites=true&w=majority`;

// use middleware
app.use(cors());
app.use(express.json());

// Home page
app.get('/', (req, res) => {
    res.send('Server is running');
});

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
        // Create Problem in vercel
        // await client.connect(); // This is not required if `autoConnect` is set to `true`
        const legoColection = client.db("BDLego").collection("legoToys");

        // All Toys API
        app.get('/alllego', async (req, res) => {
            const cursor = legoColection.find({});
            const alllego = await cursor.toArray();
            res.send(alllego);
        });
        // My Toys API Using Emal as a query
        app.get('/mytoys', async (req, res) => {
            const quary = req.query;
            const cursor = legoColection.find(quary);
            const alllego = await cursor.toArray();
            res.send(alllego);
        });

        // My Toys API Using Emal as a query and sorting by price
        app.get('/sort', async (req, res) => {
            const quary = req.query;
            const options = { sort: { price: 1 } };
            const cursor = legoColection.find(quary , options);
            const alllego = await cursor.toArray();
            res.send(alllego);
        });


        // Data Get As per Name Of the Toy
        app.get('/lego', async (req, res) => {
            const query = req.query;
            const lego = await legoColection.findOne(query);
            res.send(lego);
        });
        // Data Get As per Category
        app.get('/legos', async (req, res) => {
            const query = req.query;
            const cursor = legoColection.find(query);
            const alllego = await cursor.toArray();
            res.send(alllego);
        });
        
        // get all the Category API
        app.get('/category', async (req, res) => {
            const cursor = legoColection.find({});
            const alllego = await cursor.toArray();
            const categories = [];
            alllego.forEach(lego => {
                if (!categories.includes(lego.category)) {
                    categories.push(lego.category);
                }
            });
            res.send(categories);
        });
        // get Toy data as id API
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const lego = await legoColection.findOne(query);
            res.send(lego);
        })

        // Add Toy To the Database
        app.post('/addlego', async (req, res) => {
            const newlego = req.body;
            const result = await legoColection.insertOne(newlego);
            res.json(result);
        });

        // Delete Toy From the Database
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await legoColection.deleteOne(query);
            res.json(result);
        })

        // Update a Toy Info in the Database
        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updatedlego = req.body;
            console.log(updatedlego);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    price: updatedlego.price,
                    stock: updatedlego.stock,
                    description: updatedlego.description
                },
            };
            const result = await legoColection.updateOne(filter, updateDoc);
            res.json(result);
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




app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});