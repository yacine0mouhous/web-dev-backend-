import { Router } from "express";
import { createBooking, deleteBooking, getAllBookings, getBookingById, updateBooking } from "../controllers/bookingController";
import { verifyAuth } from "../middlewares/authMiddleware";


const bookingRouter = Router()



// Get all bookings
bookingRouter.get("/" ,getAllBookings);

// create a booking
bookingRouter.post("/create",verifyAuth ,createBooking);

// Get booking by ID
bookingRouter.get("/:id", getBookingById);

// Update booking by ID
bookingRouter.put("/:id" ,updateBooking);
// delee booking by ID
bookingRouter.delete("/:id",verifyAuth ,deleteBooking);







export default bookingRouter