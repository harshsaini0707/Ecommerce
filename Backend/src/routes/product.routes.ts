import express from 'express'
import { getAllProducts, getProductById } from '../controllers/product.controllers';
export const productRouter = express.Router();



productRouter.get('/' , getAllProducts);
productRouter.get('/:id' ,getProductById );