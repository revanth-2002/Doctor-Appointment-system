import React, { useState ,useEffect } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import moment from 'moment'
import { Table, message } from 'antd'

const Appointments = () => {
   
     const [appointments , setAppointments] = useState([])

     const getAppointments = async() => {
        try {
            const res = await axios.get('/api/v1/user/user-appointments',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                setAppointments(res.data.data)
            }
            else{
                message.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
     }
     useEffect(() => {
         getAppointments();
     },[])

     const columns = [
        {
            title:'ID',
            dataIndex:'_id'
        },
        // {
        //     title:'Name',
        //     dataIndex:'name',
        //     render:(text,record) => (
        //         <span>
        //          {record.doctorId.firstname} {record.doctorId.lastName}
        //         </span>
                
        //     )
        // },
        // {
        //     title:'Phone',
        //     dataIndex:'phone',
        //     render:(text,record) => (
        //         <span>
        //          {record.doctorInfo.phone} 
        //         </span>
                
        //     )
        // },
        {
            title:'Date & time',
            dataIndex:'date',
            render:(text,record) => (
                <span>
                 {
                    moment(record.date).format('DD-MM-YYYY') 
                 } &nbsp;
                 {
                    moment(record.time).format('HH:mm')
                 }
                </span>
                
            )
        },
        {
            title:'Status',
            dataIndex:'status',
            
        }
    ]
    return (
    <Layout>
        <h1> Appointments List </h1>
        <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default Appointments