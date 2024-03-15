import express from 'express';
import http from "http";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from "./router/authentication"
import user from 'router/user';
import {deleteUser, getAllUsers, updateUser, getUserBySessionToken} from './controllers/users';
import { isAuthenticated} from "./middlewares";
import {getMe} from "./db/users";
import {addToCart, createProduct, getCart, getProducten} from "./db/products";
const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    preflightContinue: false,

}))


app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8081, () => {
    console.log("server runt op http://localhost:8081/");

})

const MONGO_URL = "mongodb+srv://larsvermeulen:lars@cluster0.z4avwur.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on('error', (error: Error) => console.log('error'));
mongoose.connection.once('open', () => console.log('connected to database'));

app.use('/auth', authRouter());
app.get('/users',isAuthenticated, getAllUsers)
app.put('/users/:id',isAuthenticated , updateUser);
app.delete('/users/:id',isAuthenticated , deleteUser);
app.get('/admin', (req, res) => { res.sendStatus(400)  })
app.get('/me',isAuthenticated, getMe);
app.use(express.json());
app.get('/getProducten', async (req, res) => {
    try {
        const producten = await getProducten();
        res.status(200).json(producten);
    } catch (error) {
        res.status(400).json({ message: 'Het ophalen van de producten is mislukt', error: error.message });
    }

});

app.post('/createProduct', async (req, res) => {
    try {
        const nieuwProduct = await createProduct(req.body);
        res.status(201).json(nieuwProduct);
    } catch (error) {
        res.status(400).json({ message: 'Het aanmaken van het product is mislukt', error: error.message });
    }
});


app.post('/cart/add', async (req, res) => {
    const { userId, productId, aantal } = req.body;
    try {
        const updatedCart = await addToCart(userId, productId, aantal);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/cart/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const cart = await getCart(userId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Geen winkelwagentje gevonden voor deze gebruiker." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

