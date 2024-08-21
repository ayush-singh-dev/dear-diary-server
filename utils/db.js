const mongoose =  require("mongoose")
const URI = process.env.MONGODB_URI;

const connectDb = async()=>{
try {
    await mongoose.connect(URI)
    console.log("connection succesfull to database");
} catch (error) {
   console.log("connextion failed",error) 
}
}

module.exports = connectDb;


