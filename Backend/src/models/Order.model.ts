import mongoose  from "mongoose";
import { Document  } from "mongoose";
export interface IOrderItem{
    productId:number;
    title:string;
    quantity:number;
    price:number;
    image:string
}

export interface IOrder extends Document{
    userId:string;
    cartItems : IOrderItem[];
    customerName: string;
  customerEmail: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: Date;

}


const orderItemSchema = new mongoose.Schema<IOrderItem>({
 productId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
});

const orderSchema =  new mongoose.Schema<IOrder>({
userId: {
      type: String,
      required: true
    },
    cartItems: [orderItemSchema],
    customerName: {
      type: String,
      required: true,
      trim: true       
},
    customerEmail: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'completed'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);


export const Order =   mongoose.model<IOrder>('Order' , orderSchema);

