import mongoose from "mongoose";

const UserPayments = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   payments: {
      type: Array,
      default: [],
      required: true,
   }
});

export default mongoose.model('UserPayments', UserPayments);