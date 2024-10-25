import express from 'express';
import path from 'path';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import authRoutes from './routes/auth'; 

const app = express();

// MongoDB connection
const uri = "mongodb+srv://nathannoll:4kfzJAoImajfhXk3@cluster1.ag1rc.mongodb.net/?retryWrites=true&w=majority&&appname=cluster1";
const client = new MongoClient(uri);

let db;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Serve login page by default
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Connect to MongoDB and pass the db instance to the routes
client.connect()
    .then(() => {
        db = client.db('tsserver');
        console.log("Connected to MongoDB");

        app.use('/', authRoutes(db));

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error: ", err);
    });

export default app;
