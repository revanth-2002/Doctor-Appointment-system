const appointmentModel = require('../models/appointmentModel')
const doctorModel = require('../models/doctorModels')
const userModel = require('../models/userModels')


const getDoctorInfoController = async(req,res) => {
    try{
       const doctor = await doctorModel.findOne({userId : req.body.userId})
       res.status(200).send({
         success:true,
         message:'doctor data fetch success',
         data: doctor
       })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Fetching Doctor Details',
            error
        })
    }
}

const updateProfileController = async(req,res) => {
     try{
        const udoctor = await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body)
        res.status(201).send({
            success:true,
            message:'Doctor Profile updated successfully',
            data:udoctor
        })
     }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Updating Doctor Details',
            error
        })
     }
}

const getDoctorByIdController = async(req,res) => {
    try {
        const doctor = await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:'Successfully fetched the single Info',
            data:doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in single doctor info',
            error
        })
    }
}

const doctorAppointmentsController = async(req,res) => {
    try {
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        const appointments =await appointmentModel.find({doctorId:doctor._id})
        res.status(200).send({
            success:true,
            message:'Doctor Appointment fetched successfully',
            data:appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Doc Appointments'
        })
    }
}

const updateStatusController = async(req,res) => {
    try {
        const {appointmentsId , status } =req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
        const user = await userModel.findOne({_id:appointments.userId})
        const Notification = user.Notification
        Notification.push({
           type:'status-updated',
           message:`your appointment has been updated ${status}`,
           onClickPath:'/doctor-appointments'
       })
       await user.save()
       res.status(200).send({
           success:true,
           message:"Appointment Status Updated",
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in updating status',
            error
        })
    }
}
module.exports = {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController}