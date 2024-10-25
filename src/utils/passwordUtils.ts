import bcrypt from 'bcrypt';

const saltRounds = 10;

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
};

// Function to compare a plain password with a hashed password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
