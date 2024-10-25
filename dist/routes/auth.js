"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const passwordUtils_1 = require("../utils/passwordUtils");
const router = (0, express_1.Router)();
exports.default = (db) => {
    // Middleware to serve static files
    router.use(express_1.default.static('public'));
    // Register route for handling user registration
    router.post('/register-be', async (req, res) => {
        const { username, password } = req.body;
        try {
            // Access the 'users' collection in the database
            const usersCollection = db.collection('users');
            // Check if the user already exists
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
            // Hash the password before saving
            const hashedPassword = await (0, passwordUtils_1.hashPassword)(password);
            // Create a new user and save to the 'users' collection
            const newUser = { username, password: hashedPassword };
            await usersCollection.insertOne(newUser);
            // Respond with success message
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // Login route for handling user login
    router.post('/login-be', async (req, res) => {
        const { username, password } = req.body;
        try {
            // Access the 'users' collection in the database
            const usersCollection = db.collection('users');
            // Check if the user exists
            const user = await usersCollection.findOne({ username });
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            // Compare the hashed password
            const isPasswordValid = await (0, passwordUtils_1.comparePassword)(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            // Set the user in the session
            req.session.user = { username: user.username };
            res.redirect('/dashboard.html'); // Redirect to the dashboard page
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // Route to get the logged-in user's username (for displaying on the dashboard)
    router.get('/get-username', (req, res) => {
        if (req.session.user) {
            res.json({ username: req.session.user.username });
        }
        else {
            res.status(401).json({ message: 'Not logged in' });
        }
    });
    // Logout route to clear the session
    router.post('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login.html'); // Redirect to login page after logout
        });
    });
    return router;
};
