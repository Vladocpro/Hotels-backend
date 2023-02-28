import mongoose from "mongoose";
import express from "express";
import cors from "cors"
import * as validations from "./validations.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import * as UserController from "./controllers/UserController.js";
import {config} from "dotenv";
import checkAuth from "./utils/checkAuth.js";
import * as HotelController from "./controllers/HotelController.js";
import * as ServiceController from "./controllers/ServiceController.js"
import * as PaymentController from "./controllers/PaymentController.js";
import * as UserHotelsController from "./controllers/UserHotelsController.js";
config();

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() =>  console.log("DB OK"))
    .catch((err) => console.log("DB error", err));

const PORT = process.env.PORT || 4444

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/register', validations.registerValidation, handleValidationErrors, UserController.register);
app.patch('/auth/patch', checkAuth, validations.registerValidation, handleValidationErrors, UserController.edit);
app.post('/auth/login',  validations.loginValidation, handleValidationErrors,UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/hotels', HotelController.getAllHotels);
app.get('/hotels/:id', HotelController.getOneHotel);
app.post('/hotels',  checkAuth, validations.hotelCreateValidation, handleValidationErrors, HotelController.createHotel);
app.delete('/hotels', checkAuth,HotelController.removeHotel);
app.patch('/hotels',checkAuth, validations.hotelCreateValidation, handleValidationErrors, HotelController.updateHotel);


app.get('/hotels/:id/services', ServiceController.getServices);
app.get('/hotels/:id/services/:serviceId', ServiceController.getService);
app.post('/hotels/:id/services',checkAuth, validations.hotelCreateServiceValidation, handleValidationErrors, ServiceController.createService);
app.delete('/hotels/:id/services/:serviceId',checkAuth, handleValidationErrors, ServiceController.removeService);
app.patch('/hotels/:id/services/:serviceId',checkAuth,validations.hotelCreateServiceValidation, handleValidationErrors, ServiceController.updateService);


app.get('/hotels/:id/payments', PaymentController.getPayments);
app.get('/hotels/:id/payments', PaymentController.getPaymentsByHotel);
app.post('/hotels/:id/services/:serviceId/payments', checkAuth, handleValidationErrors, PaymentController.createPayment);
app.delete('/hotels/:id/payments/:paymentId',checkAuth, handleValidationErrors, PaymentController.removePayment);
app.get('/userPayments/:id', PaymentController.getPaymentsByUser)



app.get('/userHotels/:id', UserHotelsController.getUserHotels)
app.post('/userHotels', checkAuth,UserHotelsController.addHotel)
app.delete('/userHotels', checkAuth,UserHotelsController.removeHotel)
// app.post('/userHotels/:id/hotel/:hotelId', checkAuth,UserHotelsController.addHotel)

app.listen(PORT, (err) => {
    if(err) {
        return console.log(err)
    }
    console.log("Server OK")
})

