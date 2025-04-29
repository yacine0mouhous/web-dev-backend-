import { Router } from "express";
import { createProperty, deleteProperty, getAllProperties, getPropertyById, updateProperty, SearchController, predictPrice } from "../controllers/propertyController";
import { verifyAuth } from "../middlewares/authMiddleware";
import { uploadMultiple } from "../middlewares/uploadMiddleware";
import { validateInput } from "../middlewares/validateInputMiddlware";
import { PropertySchema } from "../validators/PropertySchema";

const propertyRouter = Router();

// Route to search properties
propertyRouter.get("/search", SearchController);

// Route to predict the price
propertyRouter.get("/predict", predictPrice);
/*exemple of usage 
{
  "homeStatus": 5,
  "homeType": 5,
  "city": 200,
  "state": 10,
  "yearBuilt": 2000,
  "livingAreaSqft": 1620,
  "bathrooms": 3,
  "bedrooms": 5,
  "propertyTaxRate": 0.77
}
*/ 

// Route to get all properties
propertyRouter.get("/", getAllProperties);

// Route to create a property
propertyRouter.post("/create", uploadMultiple, validateInput(PropertySchema), createProperty);

// Route to get a property by ID
propertyRouter.get("/:id", getPropertyById);

// Route to delete a property by ID
propertyRouter.delete("/:id", deleteProperty);

// Route to update a property by ID
propertyRouter.put("/:id", updateProperty);

export default propertyRouter;
