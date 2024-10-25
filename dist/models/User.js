"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUser = void 0;
// Helper function to insert a new user
const insertUser = async (db, user) => {
    const usersCollection = db.collection('users');
    return usersCollection.insertOne(user);
};
exports.insertUser = insertUser;
