import mongoose from "mongoose";

const templateSchema=new mongoose.Schema({

    name:{
        type:String,
        trim:true
    },
    weeks:
    {
        type:Array
    }
},{timestamps:true})

export default mongoose.model('WorkoutTemplate',templateSchema)