import { Request , Response , NextFunction  } from "express"


const verifyAdmin = async (req:Request , res :Response , next : NextFunction) =>{
    
    const {user} :any= req;
    if(!user){
    
    }   
    const role = user!.role;

}



const verifyOwner = async (req:Request , res :Response , next : NextFunction) =>{
    
    const {user} :any= req;
    if(!user){
    
    }   
    const role = user!.role;

}

export {verifyAdmin, verifyOwner}