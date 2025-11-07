import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Order } from '../models/Order.model.js';
import { Cart } from '../models/Cart.model.js';

dotenv.config();

const USER_ID = process.env.USER_ID!;

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, customerEmail, cartItems } = req.body;
    const userId = USER_ID;

    if (!customerName || !customerEmail) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: customerName, customerEmail'
      });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot checkout'
      });
      return;
    }

    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(customerEmail)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
      return;
    }

    
    const total = cartItems.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    );

    if (total <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid total amount'
      });
      return;
    }

    // Create order
    const order = new Order({
      userId,
      cartItems,
      customerName,
      customerEmail,
      total: parseFloat(total.toFixed(2)),
      status: 'completed',
      timestamp: new Date()
    });

    await order.save();
    console.log(`Order created with ID: ${order._id}`);

    // Clear cart after successful checkout
    await Cart.deleteOne({ userId });
    console.log(`Cart cleared for user ${userId}`);

    // Send receipt response
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order._id,
        customerName,
        customerEmail,
        total: order.total,
        itemCount: cartItems.length,
        timestamp: order.timestamp,
        status: order.status
      }
    });
  } catch (error) {
    console.error(' Error in checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process checkout',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = USER_ID;

    const orders = await Order.find({ userId }).sort({ timestamp: -1 });

    if (!orders || orders.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No orders found',
        data: []
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error(' Error in getOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = USER_ID;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
      return;
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    console.error(' Error in getOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}