import { Db } from 'mongodb';

export const insertUser = async (db: Db, user: { username: string, password: string }) => {
    const usersCollection = db.collection('users');
    return usersCollection.insertOne(user);
};
