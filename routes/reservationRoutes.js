const express = require('express')
const reservationController =require('./../controllers/reservationController')
const router = express.Router()


router.route('/')
.get(reservationController.getAllReservations)
.post(reservationController.createReservation)

router.route('/:id')
.get(reservationController.getReservation)
.patch(reservationController.updateReservation)
.delete(reservationController.deleteReservation)

router.route('/me')
.get(reservationController.getMyReservations)
.patch(reservationController.updateMyReservation)



// Reservation Management
// POST /api/reservations: Create a new reservation.
// GET /api/reservations: Get all reservations (Admin only).
// GET /api/reservations/me: Get reservations of the logged-in user.
// GET /api/reservations/:id: Get a reservation by ID.
// PUT /api/reservations/:id/update: Update reservation details (Admin only).
// DELETE /api/reservations/:id: Cancel or delete a reservation.