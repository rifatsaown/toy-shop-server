const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const legoColection = client.db("BDLego").collection("legoToys");

        app.get('/alllego', async (req, res) => {
            const cursor = legoColection.find({});
            const alllego = await cursor.toArray();
            res.send(alllego);
        });
        app.get('/mytoys', async (req, res) => {
            const quary = req.query;
            const cursor = legoColection.find(quary);
            const alllego = await cursor.toArray();
            res.send(alllego);
        });

        app.get('/lego', async (req, res) => {
            const query = req.query;
            const lego = await legoColection.findOne(query);
            res.send(lego);
        });
        app.get('/legos', async (req, res) => {
            const query = req.query;
            const cursor = legoColection.find(query);
            const alllego = await cursor.toArray();
            res.send(alllego);
        });

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
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const lego = await legoColection.findOne(query);
            res.send(lego);
        })

        app.post('/addlego', async (req, res) => {
            const newlego = req.body;
            const result = await legoColection.insertOne(newlego);
            res.json(result);
        });


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