import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        unique: true
    },
    services: {
        type: Array,
        default: [],
        required: true,
    },
    payments: {
        type: Array,
        default: [],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{
    timestamps: true,
});

export default mongoose.model('Hotel', HotelSchema);