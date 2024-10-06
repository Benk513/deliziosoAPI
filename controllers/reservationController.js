const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const Reservation = require('./../models/reservationModel')
   
exports.getAllReservations = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Reservation.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const reservations = await features.query

    res.status(200).json({
        status: 'success',
        results: reservations.length,
        data: {
            reservations
        }
    })
})

exports.createReservation = catchAsync(async (req, res, next) => {
    const newReservation = await Reservation.create(req.body)
    res.status(201).json({
        status: 'success',
        message: 'A reservation was successfully created',
        data: {
            reservation: newReservation
        }
    })
})

exports.getReservation = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) return next(new AppError('No reservation found with that ID', 404))

    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    })

})

exports.updateReservation = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    })

    if (!reservation) return next(new AppError('No reservation found with that ID', 404))

    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    })
})

exports.deleteReservation = catchAsync(async (req, res, next) => {
    await Reservation.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success',
        message: 'Reservation deleted successfully'
    })
})

exports.getMyReservations = catchAsync(async (req, res, next) => {
    const reservations = await Reservation.find({ userId: req.user.id })
    res.status(200).json({
        status: 'success',
        data: {
            reservations
        }
    })
})

exports.updateMyReservation = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    })
    if (!reservation) return next(new AppError('No reservation found with that ID', 404))
    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    })
})