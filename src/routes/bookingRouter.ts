import { Router } from "express";
import { createBooking, deleteBooking, getAllBookings, getBookingById, updateBooking } from "../controllers/bookingController";
import { verifyAuth } from "../middlewares/authMiddleware";

const bookingRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: Operations related to booking management
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings
 *     description: Retrieve a list of all bookings.
 *     responses:
 *       200:
 *         description: A list of all bookings
 */
bookingRouter.get("/", getAllBookings);

/**
 * @swagger
 * /bookings/create:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     description: Create a new booking after authenticating.
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
bookingRouter.post("/create", verifyAuth, createBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     description: Retrieve a booking by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested booking
 *       404:
 *         description: Booking not found
 */
bookingRouter.get("/:id", getBookingById);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     tags: [Bookings]
 *     summary: Update booking by ID
 *     description: Update the details of an existing booking.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated booking
 *       400:
 *         description: Invalid booking data
 *       404:
 *         description: Booking not found
 */
bookingRouter.put("/:id", updateBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     tags: [Bookings]
 *     summary: Delete booking by ID
 *     description: Delete a booking by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
bookingRouter.delete("/:id", verifyAuth, deleteBooking);

export default bookingRouter;
