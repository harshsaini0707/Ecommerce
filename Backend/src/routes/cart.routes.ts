import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cart.controllers";
export const cartRouter = express.Router();


cartRouter.post('/', addToCart);
cartRouter.get('/', getCart);
cartRouter.delete('/:productId', removeFromCart);
cartRouter.patch('/:productId', updateCartItem);