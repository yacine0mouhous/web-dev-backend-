import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Booking } from "../models/BookingModel";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import { deleteUserBooking, updateUserBookings } from "../utils/userUtils";
import { deletePropertyBooking, updatePropertyBookings } from "../utils/propertyUtils";

const BookingRepository = AppDataSource.getMongoRepository(Booking);

// function to create a booking 
const createBooking = async (req: Request, res: Response): Promise<void> => {
// part to get the clientid from the token 
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing token' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Internal server error: Missing JWT secret' });
            return;
        }
        const decoded = jwt.verify(token, jwtSecret) as unknown as { userId: string };
        const clientId= decoded.userId;

        if (!clientId || !ObjectId.isValid(clientId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }

    try {
        const { propertyId, checkInDate, checkOutDate, totalAmount } = req.body;

        if (!propertyId || !clientId || !checkInDate || !checkOutDate || !totalAmount) {
             res.status(400).json({ message: 'Missing required fields' });return
        }
        const booking = new Booking();
        booking.propertyId = new ObjectId(propertyId);
        booking.clientId = new ObjectId(clientId);
        booking.checkInDate = new Date(checkInDate);
        booking.checkOutDate = new Date(checkOutDate);
        booking.totalAmount = totalAmount;
        booking.status = 'pending'; 
        booking.bookedAt = new Date();

        const savedBooking = await BookingRepository.save(booking);
        await updateUserBookings(savedBooking.clientId,savedBooking.id)
        await updatePropertyBookings(savedBooking.propertyId,savedBooking.id)
        res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// function to update the boooking 
const updateBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { checkInDate, checkOutDate, totalAmount, status } = req.body;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid booking ID' });
            return;
        }

        const bookingId = new ObjectId(id);

        const booking = await BookingRepository.findOne({ where: { _id: bookingId } });
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        if (checkInDate) booking.checkInDate = new Date(checkInDate);
        if (checkOutDate) booking.checkOutDate = new Date(checkOutDate);
        if (totalAmount) booking.totalAmount = totalAmount;
        if (status) booking.status = status;

        await BookingRepository.save(booking);
        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// function to get all booking 
const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await BookingRepository.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// get booking by a specific id 
const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid booking ID' });
            return;
        }

        const booking = await BookingRepository.findOne({ where: { _id: new ObjectId(id) } });

        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// delete a booking 
const deleteBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid booking ID' });
            return;
        }

        const bookingId = new ObjectId(id);

        const booking = await BookingRepository.findOne({ where: { _id: bookingId } });
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        await BookingRepository.delete(bookingId);

        await deleteUserBooking(booking.clientId, bookingId);
        await deletePropertyBooking(booking.propertyId, bookingId);

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export {createBooking,updateBooking,getAllBookings,getBookingById,deleteBooking}