const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initdata = require("./data");

main().then(()=>{console.log("connected to Db")}).catch((err)=>{console.log(err);})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDb = async()=>{
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj, owner: "662de27dca16a9922a74bb77"}));
   await Listing.insertMany(initdata.data);
   console.log("data saved");
}

initDb();