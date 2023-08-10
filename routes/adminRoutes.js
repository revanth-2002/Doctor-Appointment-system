const express =require('express')
const authMiddleware = require("../middlewares/authMiddleware")
const { getAllUsersController, getAllDoctorsController, changeAccountstatusController } = require('../controllers/adminCtrl')

const router = express.Router()

// Get Method || users
router.get('/getAllUsers', authMiddleware, getAllUsersController )

// Get Method || Doctors
router.get('/getAllDoctors', authMiddleware , getAllDoctorsController)

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware , changeAccountstatusController)

module.exports = router