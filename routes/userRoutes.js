const express = require('express')
const { loginController, 
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,deleteAllNotificationController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController} = require('../controllers/userCtrl')
const authMiddleware = require("../middlewares/authMiddleware")
const { getAllDoctorController } = require('../controllers/userCtrl')
// Router object

const router = express.Router()

//routes
// LOGIN||POST
router.post('/login',loginController)

// REGISTER || POST
router.post('/register',registerController)

//Auth || POST
router.post('/getUserData',authMiddleware ,authController)

//Apply doctor || POST
router.post('/apply-doctor',authMiddleware ,applyDoctorController)

//Notification doctor || POST
router.post('/get-all-notification',authMiddleware ,getAllNotificationController)

//Notification doctor || POST
router.post('/delete-all-notification',authMiddleware ,deleteAllNotificationController)

//GET ALL DOC
router.get('/getAllDoctors', authMiddleware,getAllDoctorController)

//BOOK APPOINTMENT
router.post('/book-appointment',authMiddleware, bookAppointmentController)

//BOOK AVAILABILITY
router.post('/booking-availability',authMiddleware, bookingAvailabilityController)

//Appointment List
router.get('/user-appointments', authMiddleware, userAppointmentsController)


module.exports = router