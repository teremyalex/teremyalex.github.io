import express from 'express';
import cors from 'cors';
import {MongoClient, ObjectId, ServerApiVersion} from 'mongodb';

const app = express()
const port = process.env.PORT || 3000


const uri = "mongodb+srv://teremyalex:xch2c55ggesZwBAx@cluster0.xsgthmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

function getClient() {
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
    return new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
}

// Engedélyezd a CORS-t a lokális frontendre:
app.use(cors())

app.use(express.json())

// Gyökér útvonal kezelése
app.get('/', async (req, res) => {
    res.send("ok")
})

// Gyökér útvonal kezelése
app.get('/works', async (req, res) => {
    const client = getClient()
    try {
        await client.connect();
        const work = await client.db("portfolio").collection("works").find().toArray();
        res.json(work)
    } catch (err) {
        console.error('GET / error:', err);
        return res.status(500).json({ error: 'Adatbázis hiba történt.' });
    } finally {
        await client.close();
    }
})

app.get('/:work', async (req, res) => {
    const client = getClient()
    try {
        await client.connect();
        const work = await client.db("portfolio").collection("works").findOne({work: req.params.work})
        if(work.matchedCount === 0){
            res.send({error: `not found`})
            return
        }
        res.json(work)
    } catch (err) {
        console.error('GET / error:', err);
        return res.status(500).json({ error: 'Adatbázis hiba történt.' });
    } finally {
        await client.close();
    }
})

app.put('/:work/:button', async (req, res) => {
    const button = req.params.button
    const client = getClient()
    try {
        await client.connect();
        const work = await client.db("portfolio").collection("works").findOneAndUpdate({work: req.params.work}, { $inc: { [button]: 1 } }, { returnDocument: "after" });
        if(work.matchedCount === 0){
            res.send({error: `not found`})
            return
        }
        res.json(work)
    } catch (err) {
        console.error('POST / error:', err);
        return res.status(500).json({ error: 'Adatbázis hiba történt.' });
    } finally {
        await client.close();
    }
})


app.listen(port, '0.0.0.0', () => {
    console.log(`HTTP server listening on http://0.0.0.0:${port}`);
});
