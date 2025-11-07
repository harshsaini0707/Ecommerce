import mongoose from "mongoose";
import { Document } from "mongoose";
export interface ICartItem {
    productId : number;
    title : string;
    price :number;
    quantity : number;
    image : string;
}

export interface ICart extends Document{
userId : string;
items : ICartItem[];
createdAt:Date;
updatedAt :Date;
} 

const cartItemSchema =  new mongoose.Schema<ICartItem>({
    
    productId:{
        type : Number,
        required:true
    },
    title:{
        type:String,
        required : true
    },
    price:{
        type :Number,
        required: true
    },
    quantity:{
        type: Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const cartSchema =  new mongoose.Schema<ICart>({
    userId :{
        type:String,
        required : true
    } ,
    items : [cartItemSchema]
} , {timestamps : true});


export const Cart =   mongoose.model<ICart>('Cart'  , cartSchema);