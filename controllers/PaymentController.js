import HotelModel from "../models/Hotel.js";
import mongoose from "mongoose";
import axios from 'axios';
import {header} from "express-validator";
import UserPayments from "../models/UserPayments.js";
import UserHotels from "../models/UserHotels.js";

export const getPayments = async (req, res) => {
    try {
        const hotels = await HotelModel.find().exec();
        const payments =  hotels.map(obj => obj.payments).flat()
        res.json(payments);
    } catch (err) {
        res.status(500).json({
            message: 'Unable to get payments'
        })
    }
};
export const getPaymentsByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const doc = await UserPayments.find({user: userId });
        const payments =  doc.map(obj => obj.payments).flat()
        res.json(payments);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get payments'
        })
    }
};
export const getPaymentsByHotel = async (req, res) => {
    try {
        const hotels = await HotelModel.find({_id: req.params.id}).exec();
        const payments =  hotels.map(obj => obj.payments).flat()
        res.json(payments);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get payments'
        })
    }
};

export const getPayment = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const paymentId = req.params.paymentId;
        const hotel = await HotelModel.find({_id: hotelId}).exec();
        const payments =  hotel.map(obj => obj.payments).flat()
        if(payments.length == 0) {
            res.status(404).json({
                message: 'Unable to get payment'
            })
            return;
        }
        const payment = payments.reduce((acc, item) => {
            const { _id } = item;
            if(payment && paymentId ==_id.toString()) return {_id, ...item}
        }, [])
        if(typeof payment == typeof undefined) {
            res.status(404).json({
                message: 'Unable to get payment'
            })
            return;
        }

        res.json(payment)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get payment'
        })
    }
};

const createUserDoc = async  (userId) => {
    const doc = new UserPayments ({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        payments: []
    });
    await doc.save();
}

export const createPayment = async (req, res) => {
    try {
        // const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        const userId = req.body.user;
        const hotelId = req.body.hotel;
        const serviceId = req.body.service;
        const hotel = await HotelModel.find({_id: hotelId}).exec();
        const services =  hotel.map(obj => obj.services).flat();
        let service = undefined;
        // let service =
        services.reduce((acc, item) => {
            const { _id } = item;
            if(serviceId ==_id.toString()) {
                service = {_id, ...item}
                return
            }
        }, [])
        if(typeof service == typeof undefined) {
            res.status(404).json({
                message: 'Unable to get service'
            })
            return
        }

            const data = Math.Random() * (25 - 7) + 7

        const paymentId = new mongoose.Types.ObjectId();
        const user = await UserPayments.findOne({user: new mongoose.mongo.ObjectId(userId)})
        if(user == null)  await createUserDoc(new mongoose.mongo.ObjectId(userId));
        else if(user && user.payments.some(e => e._id.toString() == paymentId)) return res.status(400).json("Payment is already in your dashboard list");

        const date = new Date().toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute:'2-digit'})

        UserPayments.findOneAndUpdate({
          user: userId
        },{
            $push: {payments: {
                    _id: paymentId,
                    name: service.name,
                    price: service.price,
                    hotelName: hotel[0].name,
                    hotelLocation: hotel[0].location,
                    createdAt: date
                }
            }
        },{
            returnDocument: 'after'
        }, (err, doc) => {
            if(err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Unable to return dashboard list of payments'
                })
            }
        })


          const doc = HotelModel.findOneAndUpdate({
                _id: hotelId,
            }, {
                $push: {payments: {
                        _id: paymentId,
                        name: service.name,
                        price: service.price,
                        resources: data,
                        createdAt: date,
                        service: serviceId,
                        hotel: hotelId,
                        user: userId
                    }}
            },{
                returnDocument: 'after'
            }, (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return payment'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Payment was not found'
                    })
                }
                res.json(doc);
            }
        ).populate('user')

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get payments'
        })
    }
};


export const removePayment = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const paymentId = req.params.paymentId;
        HotelModel.findOneAndUpdate({
                _id: hotelId,
            }, {
                $pull: {payments: {
                        _id: new mongoose.mongo.ObjectId(paymentId)
                    }}
            },{
                returnDocument: 'after'
            }, (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return payment'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Payment was not found'
                    })
                }
                res.json(doc);
            }
        ).populate('user')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get hotels'
        })
    }
};


