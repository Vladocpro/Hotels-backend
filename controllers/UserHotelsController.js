import HotelModel from "../models/Hotel.js";
import UserHotels from "../models/UserHotels.js";
import mongoose from "mongoose";
import UserModel from "../models/User.js";

export const getUserHotels = async (req, res) => {
   try {
      const userHotels = await UserHotels.findOne({user: req.params.id})
      if(userHotels == null) return res.status(404).json({message: "Unable to find user favourites"})
      const hotels = await HotelModel.find({_id: {$in : userHotels.hotels}}).populate("user")
      res.json(hotels);
   } catch (err) {
      console.log(err)
      res.status(500).json({
         message: 'Unable to return favourites'
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

export const addHotel = async (req, res) => {
   try {
      const user = await UserHotels.findOne({user: new mongoose.mongo.ObjectId(req.body.user)})
      if(user == null)  await createUserDoc(new mongoose.mongo.ObjectId(req.body.user));
      else if(user && user.hotels.some(e => e._id.toString() === req.body.hotel.toString())) return res.status(400).json("Hotel is already in your favourites");

      const hotel = await HotelModel.findOne({_id: req.body.hotel})

       UserHotels.findOneAndUpdate({
             user: new mongoose.mongo.ObjectId(req.body.user),
          }, {
             $push: {hotels:
                    hotel._id
                }
          },{
             returnDocument: 'after'
          }, (err, doc) => {
             if(err) {
                console.log(err)
                return res.status(500).json({
                   message: 'Unable to return favourites'
                })
             }

             res.json(doc);
          }
      )

   } catch (err) {
      console.log(err)
      res.status(500).json({
         message: 'Unable to find hotels'
      })
   }
};

export const removeHotel = async (req, res) => {
   try {
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
             }

             res.json({message: "Success"});
          }
      )

   } catch (err) {
      console.log(err)
      res.status(500).json({
         message: 'Unable to find hotels'
      })
   }
};


