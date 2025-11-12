import mongoose from "mongoose";

const connectDB = async () => {
    //mongodb connection
    mongoose.connection.on("connected", () => console.log('database connected') );
   await mongoose.connect(`${process.env.MONGODB_URI}/starz`, )
}

export default connectDB;