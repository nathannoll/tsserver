//I stole the naming for this :D
// express-session.d.ts
import { Session } from 'express-session';

declare module 'express-session' {
    interface Session {
        user: { username: string }; // Customize this based on what you store in the session
    }
}
