import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Skipper from './components/Skipper';
import Protectedroute from './components/Protectedroute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notification from './pages/Notification';
import Users from './pages/admin/Users';
import Doctors from './pages/admin/Doctors';
import Profile from './pages/doctor/Profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';



function App() {

  const {loading} = useSelector(state => state.alerts)
  return (
    <>
      <BrowserRouter>
       {loading ? (<Skipper />):
          (
          <Routes>
          
          <Route path='/apply-doctor' 
          element={
          <Protectedroute>
            <ApplyDoctor />
          </Protectedroute>
          } />

          <Route path='/doctor/book-appointment/:doctorId' 
          element={
          <Protectedroute>
            <BookingPage />
          </Protectedroute>
          } />

          <Route path='/admin/users' 
          element={
          <Protectedroute>
            <Users />
          </Protectedroute>
          } />

          <Route path='/admin/doctors' 
          element={
          <Protectedroute>
            <Doctors />
          </Protectedroute>
          } />

          <Route path='/doctor/profile/:id' 
          element={
          <Protectedroute>
            <Profile />
          </Protectedroute>
          } />  

          <Route path='/notification' 
          element={
          <Protectedroute>
            <Notification />
          </Protectedroute>
          } />

          <Route path='/login' 
          element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
          } />
          <Route path='/register' 
          element={
          <PublicRoute>
            <Register/>
          </PublicRoute>
          }/>
          <Route path='/appointments' 
          element={
          <Protectedroute>
            <Appointments />
          </Protectedroute>
          }/>
          <Route path='/' 
          element={
          <Protectedroute>
            <HomePage />
          </Protectedroute>
          } />
          <Route path='/doctor-appointments' 
          element={
          <Protectedroute>
            <DoctorAppointments />
          </Protectedroute>
          }/>
          </Routes>)
       }
      </BrowserRouter>
    </>
  );
}

export default App;
