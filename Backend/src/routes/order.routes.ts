import express from "express";
import { checkout, getOrder, getOrders } from "../controllers/order.controllers";

export const orderRouter = express.Router();

orderRouter.post("/" ,checkout);
orderRouter.get("/" , getOrders);
orderRouter.get("/:orderId" , getOrder)
