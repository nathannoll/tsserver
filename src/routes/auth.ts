import express, { Router, Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { Db } from 'mongodb';

const router = Router();

export default (db: Db) => {
    router.use(express.static('public'));

    // Register route
    router.post('/register-be', async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;

        try {
            const usersCollection = db.collection('users');

            // Check if user already exists
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            // Hash the password before saving
            const hashedPassword = await hashPassword(password);

            // Create a new user and save to the 'users' collection
            const newUser = { username, password: hashedPassword };
            await usersCollection.insertOne(newUser);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Login route
    router.post('/login-be', async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;

        try {
            const usersCollection = db.collection('users');

            // Check if user exists
            const user = await usersCollection.findOne({ username });
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Compare the hashed password
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Set user in the session
            req.session.user = { username: user.username };
            res.redirect('/dashboard.html'); // Redirect to the dashboard page
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Route to get the logged-in username 
    router.get('/get-username', (req: Request, res: Response) => {
        if (req.session.user) {
            res.json({ username: req.session.user.username });
        } else {
            res.status(401).json({ message: 'Not logged in' });
        }
    });

    // Logout route to clear the session
    router.post('/logout', (req: Request, res: Response) => {
        req.session.destroy(() => {
            res.redirect('/login.html'); // Redirect to the login page
        });
    });

    return router;
};
