import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB: ${res.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};

export default connectDB;