import { ObjectId } from "mongodb";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";

const userRepository = AppDataSource.getMongoRepository(User);

/**
 * Generic function to update an array field in the User document.
 * @param userId - The ID of the user.
 * @param field - The array field to update.
 * @param value - The value to add.
 */
const updateUserArrayField = async (
    userId: ObjectId,
    field: keyof Pick<
      User,
      | "transactionIdsAsPayer"
      | "transactionIdsAsReceiver"
      | "propertyIds"
      | "notificationIds"
      | "maintenanceRequestIds"
      | "leaseIds"
      | "bookingIds"
    >,
    value: ObjectId
  ) => {
    try {
      const updateQuery = {
        $push: { [field]: value }
      } as unknown as Parameters<typeof userRepository.updateOne>[1];
      
      await userRepository.updateOne(
        { _id: userId },
        updateQuery
      );
      console.log(`${field} updated successfully for user.`);
    } catch (error) {
      console.error(`Error updating ${field} for user:`, error);
      throw error;
    }
  };
  


  /**
 * Generic function to delete an element from an array field in the User document.
 * @param userId - The ID of the user.
 * @param field - The array field to update.
 * @param value - The value to remove.
 */
const deleteFromUserArrayField = async (
  userId: ObjectId,
  field: keyof Pick<
    User,
    | "transactionIdsAsPayer"
    | "transactionIdsAsReceiver"
    | "propertyIds"
    | "notificationIds"
    | "maintenanceRequestIds"
    | "leaseIds"
    | "bookingIds"
  >,
  value: ObjectId
) => {
  try {
    const updateQuery = {
      $pull: { [field]: value }
    } as unknown as Parameters<typeof userRepository.updateOne>[1];

    await userRepository.updateOne(
      { _id: userId },
      updateQuery
    );
    console.log(`${field} updated successfully for user.`);
  } catch (error) {
    console.error(`Error updating ${field} for user:`, error);
    throw error;
  }
};
export const updateUserBookings = async (userId: ObjectId, bookingId: ObjectId) => {
  await updateUserArrayField(userId, "bookingIds", bookingId);
};

export const updateUserProperties = async (userId: ObjectId, propertyId: ObjectId) => {
  await updateUserArrayField(userId, "propertyIds", propertyId);
};

export const updateUserNotifications = async (
  userId: ObjectId,
  notificationId: ObjectId
) => {
  await updateUserArrayField(userId, "notificationIds", notificationId);
};

export const updateUserMaintenanceRequests = async (
  userId: ObjectId,
  maintenanceRequestId: ObjectId
) => {
  await updateUserArrayField(userId, "maintenanceRequestIds", maintenanceRequestId);
};

export const updateUserLeases = async (userId: ObjectId, leaseId: ObjectId) => {
  await updateUserArrayField(userId, "leaseIds", leaseId);
};

export const updateUserTransactionsAsPayer = async (
  userId: ObjectId,
  transactionId: ObjectId
) => {
  await updateUserArrayField(userId, "transactionIdsAsPayer", transactionId);
};

export const updateUserTransactionsAsReceiver = async (
  userId: ObjectId,
  transactionId: ObjectId
) => {
  await updateUserArrayField(userId, "transactionIdsAsReceiver", transactionId);
};


export const deleteUserBooking = async (userId: ObjectId, bookingId: ObjectId) => {
  await deleteFromUserArrayField(userId, "bookingIds", bookingId);
};

export const deleteUserProperty = async (userId: ObjectId, propertyId: ObjectId) => {
  await deleteFromUserArrayField(userId, "propertyIds", propertyId);
};

export const deleteUserNotification = async (
  userId: ObjectId,
  notificationId: ObjectId
) => {
  await deleteFromUserArrayField(userId, "notificationIds", notificationId);
};

export const deleteUserMaintenanceRequest = async (
  userId: ObjectId,
  maintenanceRequestId: ObjectId
) => {
  await deleteFromUserArrayField(userId, "maintenanceRequestIds", maintenanceRequestId);
};

export const deleteUserLease = async (userId: ObjectId, leaseId: ObjectId) => {
  await deleteFromUserArrayField(userId, "leaseIds", leaseId);
};

export const deleteUserTransactionAsPayer = async (
  userId: ObjectId,
  transactionId: ObjectId
) => {
  await deleteFromUserArrayField(userId, "transactionIdsAsPayer", transactionId);
};

export const deleteUserTransactionAsReceiver = async (
  userId: ObjectId,
  transactionId: ObjectId
) => {
  await deleteFromUserArrayField(userId, "transactionIdsAsReceiver", transactionId);
};