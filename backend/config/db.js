import mongoose from "mongoose";


//create mongodb connection
const ConnectDB = async()=>{
    if(!process.env.MONGO_URL){
        throw new Error("please defind MONGO_URl variabel inside the .env file");
 
    }
    
    try {
        
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connection failed",error)
    }
}

export default ConnectDB;