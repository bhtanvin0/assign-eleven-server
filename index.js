const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vg6bj1z.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db("DB_PHOTOGRAPHY").collection("services");
        const reviewsCollection = client.db("DB_PHOTOGRAPHY").collection('reviews');


        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3);
            const result = await cursor.toArray()
            res.send(result)
        })



        app.get('/service/all', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/service/all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.get("/addreviews", async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query).sort({ time: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/addreviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)

        })

        app.post("/service/all", async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id }

            const cursor = reviewsCollection.find(query)
            const review = await cursor.toArray()
            res.send(review);
        })
        app.get('/reviews', async (req, res) => {

            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email,
                }
            }


            const cursor = reviewsCollection.find(query)
            const review = await cursor.toArray()
            res.send(review);
        })


        app.delete('/reviews/:id', async (req, res) => {
            const users = req.params.id


            const result = await reviewsCollection.simpleNode({ _id: ObjectId(users) })


            res.send(result)

        }


        )


    } finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('photography server is running')
})

app.listen(port, () => {
    console.log(`photographyserver running on${port}`);
})