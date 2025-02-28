import { Router } from "express"
import { createProperty, deleteProperty, getAllProperties, getPropertyById, updateProperty } from "../controllers/propertyController";
import { verifyAuth } from "../middlewares/authMiddleware";

const propertyRouter = Router()

// Get all properties
propertyRouter.get("/" ,getAllProperties);

// create a property
propertyRouter.post("/create" ,createProperty);

// Get property by ID
propertyRouter.get("/:id", getPropertyById);


// Delete Property By Id
propertyRouter.delete("/:id", deleteProperty);

// Update property by ID
propertyRouter.put("/:id" ,updateProperty);








export default propertyRouter