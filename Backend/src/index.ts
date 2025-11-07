import express from 'express'
import { connectDB } from "./utils/dbConnection";
import dotenv from "dotenv"
import cors from "cors"
import { productRouter } from './routes/product.routes';
import { cartRouter } from './routes/cart.routes';
import { orderRouter } from './routes/order.routes';
dotenv.config();

const app =  express();
const PORT = process.env.PORT!;

app.use(cors());
app.use(express.json());


app.use("/api/products" ,  productRouter);
app.use("/api/cart" ,  cartRouter);
app.use("/api/checkout" , orderRouter)

connectDB().then(()=>{
    app.listen(PORT , ()=>{
        console.log('Server Started');
        
    })
}).catch((error)=>{
console.log(error);

})