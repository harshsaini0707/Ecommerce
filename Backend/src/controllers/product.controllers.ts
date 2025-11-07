import { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config()


export interface IProduct {
    id :number;
    title: string;
    price:number;
    description: string;
    category :string;
    image:string;
    rating :{
        rate:number;
        count:number;
    }
}

const FAKE_STORE_API =  process.env.FAKE_STORE_API!;

export const getAllProductsService= async():Promise<IProduct[]> =>{
    try {
        const response = await fetch(FAKE_STORE_API);
     //   if(!response.ok)console.error('dummy data will add soon');

        const products : IProduct[] =  await response.json();
        //as told in assignment that only 5-10 items
        return products.slice(0, 10); 
        
    } catch (error) {
       console.error('Error while fetching product' , error);
       throw error; 
    }
}


export const getProductByIdService = async(id : number) : Promise<IProduct> =>{
    try {
        if(!id) throw new Error("Product Id Requied!!");
        const response = await fetch(`${FAKE_STORE_API}/${id}`);
        const product : IProduct = await response.json();
        return product;
    } catch (error) {
       console.error('Error while fetching product' , error);
       throw error;  
    }
} 


export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await getAllProductsService();
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}


export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await getProductByIdService(Number(id));
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Product not found',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}