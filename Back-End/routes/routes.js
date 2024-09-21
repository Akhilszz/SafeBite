const express = require('express');
const router = express.Router();
const User = require('../controller/userController');
const Hotel = require('../controller/hotelController');
const Login = require('../controller/Login')
const Officer = require('../controller/officerController')
const upload = require('../middleware/upload')
const Noti = require('../controller/NotiController')
const auth = require('../middleware/Authenticate')




router.post('/register/User', User.registerUser);
router.post('/register/Restaurant', Hotel.registerHotel);
router.post('/login', Login.Login)
router.get('/GetHotel', Hotel.GetHotel)
router.post('/request/:id', Hotel.Update)
router.put('/updatehotel/:id', Hotel.Update)
router.post('/addofficer', Officer.AddOfficer)
router.get('/getofficer', Officer.GetOfficer)
router.put('/updateOfficer/:id', Officer.UpdateOfficer)
router.post('/report/:id', Officer.Report)
router.delete('/deleteOfficer/:id', Officer.DeleteOfficer)
router.get('/getuser', User.GetUser)
router.put('/updateUserStatus/:id', User.updateUserStatus)
router.put('/blacklist/:id', Hotel.Update)
router.post('/sendComplaint', Hotel.AddComp)
router.post('/sendSuggestion', Hotel.AddSugge)
router.post('/publicnotification', Noti.PublicNoti)
router.post('/hotelnotification/:id', Noti.HotelNoti)
router.get('/getnotification', Noti.GetNoti)
router.post('/fetchhotel', Hotel.fetchHotel)
router.post('/replySuggestion', Hotel.ReplySug)
router.post('/replyComplaint', Hotel.ReplyComp)
router.get('/getcomplaints/:userId', Hotel.GetCom)
router.get('/getsuggestions/:userId', Hotel.GetSug)
router.get('/fetchuser/:id', User.FetchUser)
router.delete('/deleteuser/:id', User.Delete)
router.get('/blacklistcom/:id', Hotel.Comp)
router.post('/inspection', Officer.Inspection)
router.get('/getinspection/:id', Officer.GetInspection)
router.post('/fetchinspection', Hotel.GetInspection)
router.post('/documentupload/:hotelId', Hotel.DocumentUpload)
router.post('/permission', Officer.Permission)
router.post('/permissiongrant', Officer.PermUpdate)
router.post('/inspectermessage', Officer.AddNotification)
router.post('/forgotpassword', Login.ForgotPassword)
router.post('/resetpassword', Login.ResetPassword)


module.exports = router;

