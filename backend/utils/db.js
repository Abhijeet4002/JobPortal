import mongoose from "mongoose";

const connectDB = async () => {
    // Attempt to connect and bubble up any error to the caller
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongodb connected successfully');
}
export default connectDB;