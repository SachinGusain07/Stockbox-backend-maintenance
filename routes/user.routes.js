import express from 'express'
import protectRoute from '../utils/protectRoute.js'
import { Login, Logout, updateProfile } from '../controller/user.controller.js'


const UserRoute = express.Router() 


UserRoute.post("/login" ,Login )
UserRoute.post("/logout" ,protectRoute ,Logout )
UserRoute.post("/update-credentials" , protectRoute  )
UserRoute.patch("/update-credentials" , protectRoute  , updateProfile)

export default UserRoute;