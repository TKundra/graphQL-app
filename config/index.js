require('dotenv').config();

const {
    MONGO_URI,
    PORT,
    DEBUG_MODE,
    JWT_SECRET
} = process.env;

export {MONGO_URI, PORT, DEBUG_MODE, JWT_SECRET}