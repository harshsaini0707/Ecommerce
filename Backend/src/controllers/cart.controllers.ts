import { Request, Response } from 'express';
import dotenv from "dotenv"
import { Cart } from '../models/Cart.model.js';
dotenv.config();

const USER_ID = process.env.USER_ID!;

export const addToCart = async(req  :Request ,  res: Response) : Promise<void>=>{
try {
    const{productId , title , price , quantity , image } = req.body;
    const userId = USER_ID;

     if (!productId || !title || !price || !quantity || !image) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: productId, title, price, quantity, image'
      });
      return;
    }


    if(quantity <=0){
        res.status(400).json({
            success:false,
            message:"Quantity must be greater than 0"

        })
        return;
    }

    let cart = await Cart.findOne({userId});

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

        // Check if item already exists
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      console.log(` Updated quantity for product ${productId}`);
    } else {
      cart.items.push({ productId, title, price, quantity, image });
      console.log(` Added new product ${productId} to cart`);
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });

    
} catch (error) {
    console.error(' Error in addToCart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
}
}


export const getCart =  async (req :Request ,  res : Response): Promise<void>=>{
    try {
        const userId = USER_ID;
        let cart = await Cart.findOne({userId});

           if (!cart) {
      res.status(200).json({
        success: true,
        message: 'Cart is empty',
        data: {
          userId,
          items: [],
          total: 0,
          itemCount: 0
        }
      });
      return;
    }
 // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: {
        ...cart.toObject(),
        total: parseFloat(total.toFixed(2)),
        itemCount: cart.items.length
      }
    });
        
    } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });  
    }
}

export const removeFromCart =  async(req:Request , res: Response) :Promise<void>=>{
    try {
        const { productId} =  req.params;
        const userId = USER_ID;


         if (!productId || isNaN(Number(productId))) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
      return;
    }

     const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: Number(productId) } } },
      { new: true }
    );


     if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    console.log(` Removed product ${productId} from cart`);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });


    
        
    } catch (error) {
      console.error(' Error in removeFromCart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error instanceof Error ? error.message : 'Unknown error'
    });   
    }
}

export const updateCartItem =  async(req:Request ,  res : Response): Promise<void>=>{
    try {
        const {productId} = req.params;
        const {quantity} =  req.body;
        const userId = USER_ID;

          if (!productId || isNaN(Number(productId))) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
      return;
    }


    if (!quantity || quantity <= 0) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
      return;
    }


    const cart = await Cart.findOne({userId});

    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
      return;
    }

    const item = cart.items.find(item => item.productId === Number(productId))

     if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
      return;
    }

        item.quantity = quantity;
    await cart.save();

    console.log(` Updated quantity for product ${productId} to ${quantity}`);

    res.status(200).json({
      success: true,
      message: 'Item quantity updated successfully',
      data: cart
    });

    } catch (error) {
       console.error(' Error in updateCartItem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error instanceof Error ? error.message : 'Unknown error'
    }); 
    }
}