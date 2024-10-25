"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const mongodb_1 = require("mongodb");
const auth_1 = __importDefault(require("./routes/auth")); // Import auth route as a function
const app = (0, express_1.default)();
// MongoDB connection
const uri = "mongodb+srv://nathannoll:4kfzJAoImajfhXk3@cluster1.ag1rc.mongodb.net/?retryWrites=true&w=majority&&appname=cluster1";
const client = new mongodb_1.MongoClient(uri);
let db;
// Middleware setup
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, express_session_1.default)({
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
    // Use the auth routes and pass the db instance to them
    app.use('/', (0, auth_1.default)(db));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error("MongoDB connection error: ", err);
});
exports.default = app;
