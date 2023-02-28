import HotelModel from "../models/Hotel.js";
import mongoose from "mongoose";
import UserHotels from "../models/UserHotels.js";
import * as UserHotelsController from "./UserHotelsController.js";
import axios from "axios";
import checkAuth from "../utils/checkAuth.js";


export const getAllHotels = async (req, res) => {
    try {
        const hotels = await HotelModel.find().populate('user').exec();
        res.json(hotels);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get hotels'
        })
    }
};



export const getOneHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        HotelModel.findOne({
                _id: hotelId,
            },  (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return hotel'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Hotel was not found'
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

export const removeHotel = async (req, res) => {
    try {
        const hotelId = req.body.hotel;
        HotelModel.findOneAndDelete({
            _id: hotelId
        }, (err, doc) => {
            if(err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Unable to delete hotel'
                })
            }
            if(!doc) {
                return res.status(404).json({
                    message: 'Unable to get hotel'
                })
            }
            UserHotels.findOneAndUpdate({
                user: new mongoose.mongo.ObjectId(req.body.user),
            }, {
                $pull: {"hotels": new mongoose.mongo.ObjectId(req.body.hotel)}
            },{
                returnDocument: 'after'
            }, (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return favourites'
                    })
                }})
            res.json({
                success: true
            })
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get hotels'
        })
    }
};

const createUserDoc = async  (userId) => {
    const doc = new UserHotels ({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        hotels: []
    });
    await doc.save();
    console.log(doc)

}
export const createHotel = async (req, res) => {
    try {

        const hotelId = new mongoose.mongo.ObjectId()
        const doc = new HotelModel ({
            _id: hotelId,
            name: req.body.name,
            location: req.body.location,
            services: [],
            payments: [],
            user: req.body.user,
        });
        const hotel = await doc.save();
        // add to favourites because owner
        const user = await UserHotels.findOne({user: new mongoose.mongo.ObjectId(req.body.user)})
        if(user == null)  await createUserDoc(new mongoose.mongo.ObjectId(req.body.user));
        await UserHotels.findOneAndUpdate({
                user: new mongoose.mongo.ObjectId(req.body.user),
            }, {
                $push: {hotels:
                    doc._id
                }
            },{
            returnDocument: 'after'
        });
        res.json(hotel)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to create an hotel'
        })
    }
};



export const updateHotel = async (req, res) => {
    try {

        const hotelId = req.body.hotel;
        await HotelModel.updateOne({
                _id: hotelId,
            },
            {
                name: req.body.name,
                location: req.body.location,
                services: req.body.services,
                payments: req.body.payments,
                user: req.body.userId,
            })
        res.json({
            success: true
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to update hotel'
        })
    }
};





