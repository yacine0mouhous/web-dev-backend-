import { Router } from "express";
import { createProperty, deleteProperty, getAllProperties, getPropertyById, updateProperty, SearchController } from "../controllers/propertyController";
import { verifyAuth } from "../middlewares/authMiddleware";
import { uploadMultiple } from "../middlewares/uploadMiddleware";
import { validateInput } from "../middlewares/validateInputMiddlware";
import { PropertySchema } from "../validators/PropertySchema";

const propertyRouter = Router();
/**
 * @swagger
 * /properties/search:
 *   get:
 *     tags: [Properties]
 *     summary: Search for properties based on various criteria
 *     description: Allows searching for properties by country, state, city, status, type, and category.
 *     parameters:
 *       - in: query
 *         name: country
 *         required: false
 *         schema:
 *           type: string
 *         description: The country of the property to search for.
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *         description: The state of the property to search for.
 *       - in: query
 *         name: city
 *         required: false
 *         schema:
 *           type: string
 *         description: The city of the property to search for.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["available", "rented", "sold", "inactive"]
 *         description: The status of the property (e.g., available, rented, sold, inactive).
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["real_estate", "rented_real_estate", "hotel"]
 *         description: The type of the property (e.g., real estate, rented real estate, hotel).
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: The category of the property (e.g., commercial, residential).
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Properties retrieved successfully
 *                 properties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: ["available", "rented", "sold", "inactive"]
 *                       type:
 *                         type: string
 *                         enum: ["real_estate", "rented_real_estate", "hotel"]
 *                       category:
 *                         type: string
 *       404:
 *         description: No properties found matching the search criteria
 *       500:
 *         description: Internal server error
 */
propertyRouter.get("/search", SearchController);

/**
 * @swagger
 * /properties:
 *   get:
 *     tags: [Properties]
 *     summary: Get all properties
 *     description: Retrieve a list of all properties.
 *     responses:
 *       200:
 *         description: A list of all properties
 */
propertyRouter.get("/", getAllProperties);

/**
 * @swagger
 * /properties/create:
 *   post:
 *     tags: [Properties]
 *     summary: Create a new property
 *     description: Create a new property with validation and multiple image uploads.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid property data
 */
propertyRouter.post("/create", uploadMultiple, validateInput(PropertySchema), createProperty);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get a property by ID
 *     description: Retrieve a property by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the property
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested property
 *       404:
 *         description: Property not found
 */
propertyRouter.get("/:id", getPropertyById);

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete a property by ID
 *     description: Delete a property by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the property
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
propertyRouter.delete("/:id", deleteProperty);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update a property by ID
 *     description: Update the details of an existing property.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the property to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Invalid property data
 *       404:
 *         description: Property not found
 */
propertyRouter.put("/:id", updateProperty);

export default propertyRouter;
