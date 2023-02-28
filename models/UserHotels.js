import mongoose from "mongoose";

const UserHotels = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotels: {
        type: Array,
        default: [],
        required: true,
    }
});

export default mongoose.model('UserHotels', UserHotels);