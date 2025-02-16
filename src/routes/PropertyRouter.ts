import express from 'express';
import { createProperty, getPropertyById , updateProperty, deleteProperty } from '../controllers/PropertyController';
import { verifyAuth } from '../middlewares/authMiddleware';
import verifieRole from '../middlewares/verifyRoleMiddleware';

const PropertyRouter = express.Router();

// Create Property
PropertyRouter.post('/properties',verifyAuth , verifieRole(["owner","admin"]) , createProperty);

// Get Property by ID
PropertyRouter.get('/properties/:id',verifyAuth , verifieRole(["owner","admin"]) ,  getPropertyById);

// Update Property
PropertyRouter.put('/properties/:id', verifieRole(["owner","admin"]),  updateProperty);

// Delete Property
PropertyRouter.delete('/properties/:id',verifyAuth , verifieRole(['owner','admin']) ,  deleteProperty);

export default PropertyRouter;
