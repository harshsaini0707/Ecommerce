import express from "express";
import { checkout, getOrder } from "../controllers/order.controllers";

export const orderRouter = express.Router();

orderRouter.get("/" ,checkout);
orderRouter.get("/" , getOrder);
