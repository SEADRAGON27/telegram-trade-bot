import mongoose from "mongoose";

const userNotificationSchema = mongoose.Schema({
    
    cryptocurrancy:{
        type: String,
        required: true,
    },
    
    price:{
        type: Number,
        required: true,
    },
    
    notification:{
        type:String,
        required: false
    },
    
    userId:{
        type:Number,
        required: true
    },
    
    telegram:{
        type:Boolean,
        required:false
    },

    phone:{
        type:String,
        required:false
    },

    both:{
        type:Boolean,
        required:false
    }
})

export const UserNotification = mongoose.model('User_notification', userNotificationSchema);