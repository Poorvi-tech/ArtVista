const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    paymentId: { type: String }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
