const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModels')
const appointmentModel = require('../models/appointmentModel')
const moment = require('moment')

//register callback
const registerController = async(req,res) => {
    try{
       const exisitingUser = await userModel.findOne({email:req.body.email})
       if(exisitingUser)
       {
         return res.status(200).send({message:'User Already Exist', success:false})
       }
       const password = req.body.password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password,salt)
       req.body.password = hashedPassword
       const newUser = new userModel(req.body)
       await newUser.save()
       res.status(201).send({message:"Register Successfully",success : true });
    }catch(error)
    {
        console.log(error);
        res.status(500).send({success:false, message:`Register controller ${error.message}`})
    }
}

// login callback
const loginController = async (req,res) => {
    try{
       const user = await userModel.findOne({email:req.body.email})
       if(!user)
       {
           //console.log(user.email)
           return res.status(200).send({message:"user not found",success:false})
       }
       const isMatch = await bcrypt.compare(req.body.password,user.password)
       if(!isMatch)
       {
          return res.status(200).send({message:"Invalid Email or Password",success:false})
       }
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '1d'})
       res.status(200).send({message:'Login Success',success:true,token})
    }catch(error)
    {
        console.log(error)
        res.status(500).send({message:`Error in login CTRL ${error.message}`})
    }
}

const authController = async(req,res) => {
    try{
       const user = await userModel.findById({_id:req.body.userId})
       user.password = undefined;
       if(!user)
       {
          return res.status(200).send({message : 'User Not found',success : false})
       }else{
          res.status(200).send({success:true,data:user})
       }
    }catch(error){
        console.log(error)
        res.status(500).send({message: 'auth error', success:false,error})
    }
};

// apply Doctor CTRL
const applyDoctorController = async(req,res) => {
     try{
        const newDoctor = await doctorModel({...req.body,status:'pending'})
        await newDoctor.save()
        const adminUser = await userModel.findOne({isAdmin:true})
        const Notification = adminUser.Notification
        Notification.push({
            type:'apply-doctor-request',
            message: `${newDoctor.firstname} ${newDoctor.lastName} has applied for a doctor Account`
            ,data:{
                doctorId: newDoctor._id,
                name:newDoctor.firstname + " "+ newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id,{Notification})
        res.status(201).send({
            success:true,
            message:'Doctor Account Applied Successfully'
        })
     } catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message : "Error While Applying For Doctor"
        })
     }
}


// Notification controller
const getAllNotificationController = async(req,res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId})
        const seennotification = user.seennotification
        const Notification = user.Notification
        seennotification.push(...Notification)
        user.Notification = []
        user.seennotification = Notification
        const updatedUser = await user.save()
        res.status(200).send({
            success:true,
            message:'all notification marked as read',
            data:updatedUser,
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            message: 'Error in notification',
            success: false,
            error
        })
    }
}

// delete notification controller
const deleteAllNotificationController = async(req,res) => {
    try{
       const user = await userModel.findOne({_id:req.body.userId})
       user.Notification = []
       user.seennotification = []
       const updatedUser = await user.save()
       updatedUser.password = undefined
       res.status(200).send({
            success:true,
            message:'Notifications Deleted successfully',
            data : updatedUser,

       })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'unable to delete all notifications',
            error
        })
    }
}


//GET ALL DOC
const getAllDoctorController = async(req,res) => {
    try {
        const doctors = await doctorModel.find({status:'approved'})
        res.status(200).send({
            success:true,
            message:"Doctors Lists Fetched Successfully",
            data:doctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while fetching doctors',
            error
        })
    }
}

//BOOK APPOINTMENT
const bookAppointmentController = async(req,res) => {
   try {
       req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
       req.body.time =moment(req.body.time,'HH:mm').toISOString()
       req.body.status = "pending"
       const newAppointment = new appointmentModel(req.body)
       await newAppointment.save()
       const user = await userModel.findOne({_id:req.body.doctorInfo.userId})
       user.Notification.push({
           type:'New-appointment-request',
           message:`A new Appointment Request from ${req.body.userInfo.name}`,
           onClickPath:'/user/appointments'
       })
       await user.save()
       res.status(200).send({
           success:true,
           message:'Appointment Book successfully'
       })
   } catch (error) {
      console.log(error),
      res.status(500).send({
        success:false,
        message: 'Error while booking Appointment',
        error
      })
   }
}

//BOOKING AVAILABILITY
const bookingAvailabilityController = async (req,res) => {
     try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        const fromTime = moment(req.body.time,"HH:mm").subtract(1, 'hours').toISOString()
        const toTime = moment(req.body.time,"HH:mm").add(1, 'hours').toISOString()
        const doctorId = req.body.doctorId
        const appointments = await appointmentModel.find({doctorId,date,
        time:{
            $gte:fromTime,$lte:toTime
        }})
        
        if(appointments.length > 0){
            return res.status(500).send({
                success:false,
                message:'Appointment Not available at this time!'
            })
        }else{
            return res.status(200).send({
                 success:true,
                 message:'Appointments Available'
            })
        }
     } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            message:'Something is wrong with booking availability',
            error
        })
     }
}

const userAppointmentsController = async(req,res) =>{
    try {
        const appointments = await appointmentModel.find({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'users appointment fetched successfully',
            data:appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
           success:false,
           error,
           message:'Error In User Appointments' 
        })
    }
}
module.exports = {loginController,registerController,authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController,getAllDoctorController,bookAppointmentController,bookingAvailabilityController,userAppointmentsController};