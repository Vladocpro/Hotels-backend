import HotelModel from "../models/Hotel.js";
import mongoose from "mongoose";


export const getServices = async (req, res) => {
    try {
        const hotels = await HotelModel.find({_id: req.params.id}).exec();
        const services =  hotels.map(obj => obj.services).flat()
        res.json(services);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get services'
        })
    }
};


export const getService = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const serviceId = req.params.serviceId;
        const hotel = await HotelModel.find({_id: hotelId}).exec();
        const services =  hotel.map(obj => obj.services).flat()
        if(services.length == 0) {
            res.status(404).json({
                message: 'Unable to get service'
            })
            return;
        }
        const service = services.reduce((acc, item) => {
            const { _id } = item;
            if(serviceId ==_id.toString()) return {_id, ...item}
        }, [])
        if(typeof service == typeof undefined) {
            res.status(404).json({
                message: 'Unable to get service'
            })
            return
        }
        res.json(service)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get service'
        })
    }
};


export const createService = async (req, res) => {
    try {
        const hotelId = req.body.hotel;
        HotelModel.findOneAndUpdate({
                _id: hotelId,
            }, {
                $push: {services: {
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        price: req.body.price,
                        hotel: hotelId
                    }}
            },{
                returnDocument: 'after'
            }, (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return service'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Service was not found'
                    })
                }
                res.json(doc);
            }
        ).populate('user')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get services'
        })
    }
};


export const removeService = async (req, res) => {
    try {
        const hotelId = req.body.hotel;
        const serviceId = req.body.service;
        HotelModel.findOneAndUpdate({
                _id: hotelId,
            }, {
                $pull: {services: {
                        _id: new mongoose.mongo.ObjectId(serviceId)
                    }}
            },{
                returnDocument: 'after'
            }, (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return service'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Service was not found'
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


export const updateService = async (req, res) => {
    try {
        const hotelId = req.body.hotel;
        const serviceId = req.body.service;

        HotelModel.findOneAndUpdate({
                _id: new mongoose.mongo.ObjectId(hotelId),
                "services._id":  new mongoose.mongo.ObjectId(serviceId)
            }, {
                $set:  {
                        "services.$._id": new mongoose.mongo.ObjectId(serviceId),
                        "services.$.name": req.body.name,
                        "services.$.price": req.body.price,
                        "services.$.hotel": hotelId
                    }
            },  {
                returnDocument: 'after'
            }, (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Unable to return service'
                    })
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Service was not found'
                    })
                }
                res.json(doc);
            }
        ).populate('user')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Unable to get services'
        })
    }
};

