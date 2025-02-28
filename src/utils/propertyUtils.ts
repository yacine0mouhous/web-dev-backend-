import { ObjectId } from "mongodb";
import { AppDataSource } from "../config/data-source";
import { Property } from "../models/PropertyModel";

const propertyRepository = AppDataSource.getMongoRepository(Property);

/**
 * Generic function to update an array field in the Property document.
 * @param propertyId - The ID of the property.
 * @param field - The array field to update.
 * @param value - The value to add.
 */
const updatePropertyArrayField = async (
  
  propertyId: ObjectId,
  field: keyof Pick<
    Property,
    | "transactionIds"
    | "maintenanceRequestIds"
    | "leaseIds"
    | "bookingIds"
    | "images"
  >,
  value: ObjectId | string
) => {
  try {
    const updateQuery = {
      $push: { [field]: value }
    } as unknown as Parameters<typeof propertyRepository.updateOne>[1];
    
    await propertyRepository.updateOne(
      { _id: propertyId },
      updateQuery
    );
    console.log(`${field} updated successfully for property.`);
  } catch (error) {
    console.error(`Error updating ${field} for property:`, error);
    throw error;
  }
};
/**
 * Generic function to delete an element from an array field in the Property document.
 * @param propertyId - The ID of the property.
 * @param field - The array field to update.
 * @param value - The value to remove.
 */
const deleteFromPropertyArrayField = async (
  propertyId: ObjectId,
  field: keyof Pick<
    Property,
    | "transactionIds"
    | "maintenanceRequestIds"
    | "leaseIds"
    | "bookingIds"
    | "images"
  >,
  value: ObjectId | string
) => {
  try {
    const updateQuery = {
      $pull: { [field]: value }
    } as unknown as Parameters<typeof propertyRepository.updateOne>[1];

    await propertyRepository.updateOne(
      { _id: propertyId },
      updateQuery
    );
    console.log(`${field} updated successfully for property.`);
  } catch (error) {
    console.error(`Error updating ${field} for property:`, error);
    throw error;
  }
};
export const updatePropertyTransactions = async (
  propertyId: ObjectId,
  transactionId: ObjectId
) => {
  await updatePropertyArrayField(propertyId, "transactionIds", transactionId);
};

export const updatePropertyMaintenanceRequests = async (
  propertyId: ObjectId,
  maintenanceRequestId: ObjectId
) => {
  await updatePropertyArrayField(propertyId, "maintenanceRequestIds", maintenanceRequestId);
};

export const updatePropertyLeases = async (
  propertyId: ObjectId,
  leaseId: ObjectId
) => {
  await updatePropertyArrayField(propertyId, "leaseIds", leaseId);
};

export const updatePropertyBookings = async (
  propertyId: ObjectId,
  bookingId: ObjectId
) => {
  await updatePropertyArrayField(propertyId, "bookingIds", bookingId);
};

export const updatePropertyImages = async (
  propertyId: ObjectId,
  imageUrl: string
) => {
  await updatePropertyArrayField(propertyId, "images", imageUrl);
};

/**
 * Update multiple fields of a property at once
 * @param propertyId - The ID of the property
 * @param updateData - Object containing the fields to update
 */
export const updatePropertyDetails = async (
  propertyId: ObjectId,
  updateData: Partial<Omit<Property, "id" | "createdAt">>
) => {
  try {
    const updateQuery = {
      $set: { ...updateData, updatedAt: new Date() }
    } as unknown as Parameters<typeof propertyRepository.updateOne>[1];
    
    await propertyRepository.updateOne(
      { _id: propertyId },
      updateQuery
    );
    console.log("Property details updated successfully.");
  } catch (error) {
    console.error("Error updating property details:", error);
    throw error;
  }
};

/**
 * Update the status of a property
 * @param propertyId - The ID of the property
 * @param status - The new status
 */
export const updatePropertyStatus = async (
  propertyId: ObjectId,
  status: Property["status"]
) => {
  try {
    await updatePropertyDetails(propertyId, { status });
    console.log(`Property status updated to ${status}.`);
  } catch (error) {
    console.error("Error updating property status:", error);
    throw error;
  }
};

/**
 * Update pricing information for a property
 * @param propertyId - The ID of the property
 * @param sellPrice - The sale price (optional)
 * @param rentPrice - The rental price (optional)
 */
export const updatePropertyPricing = async (
  propertyId: ObjectId,
  sellPrice?: number,
  rentPrice?: number
) => {
  const updates: Partial<Pick<Property, "sellPrice" | "rentPrice">> = {};
  
  if (sellPrice !== undefined) updates.sellPrice = sellPrice;
  if (rentPrice !== undefined) updates.rentPrice = rentPrice;
  
  if (Object.keys(updates).length > 0) {
    await updatePropertyDetails(propertyId, updates);
    console.log("Property pricing updated successfully.");
  }
};


export const deletePropertyTransaction = async (
  propertyId: ObjectId,
  transactionId: ObjectId
) => {
  await deleteFromPropertyArrayField(propertyId, "transactionIds", transactionId);
};

export const deletePropertyMaintenanceRequest = async (
  propertyId: ObjectId,
  maintenanceRequestId: ObjectId
) => {
  await deleteFromPropertyArrayField(propertyId, "maintenanceRequestIds", maintenanceRequestId);
};

export const deletePropertyLease = async (
  propertyId: ObjectId,
  leaseId: ObjectId
) => {
  await deleteFromPropertyArrayField(propertyId, "leaseIds", leaseId);
};

export const deletePropertyBooking = async (
  propertyId: ObjectId,
  bookingId: ObjectId
) => {
  await deleteFromPropertyArrayField(propertyId, "bookingIds", bookingId);
};

export const deletePropertyImage = async (
  propertyId: ObjectId,
  imageUrl: string
) => {
  await deleteFromPropertyArrayField(propertyId, "images", imageUrl);
};