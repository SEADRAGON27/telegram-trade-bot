import mongoose from "mongoose";

const apiKeySchema = mongoose.Schema({
    userId:{
        type:Number,
        required:true
    },
    
    passPhrase:{
        type:String,
        required:true
    },
    
    apiSecret:{
        type:String,
        required:true
    },
    
    apiKey:{
        type:String,
        required:true
    }
})

export const ApiKey = mongoose.model('Api_key',apiKeySchema)