const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const stripe = require('stripe');

// Mock checkout: place order
router.post('/', async (req, res) => {
    const { user, items, totalAmount } = req.body; // frontend sends this
    try {
        const order = new Order({ user, items, totalAmount });
        await order.save();
        res.json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Stripe payment integration
router.post('/pay', async (req, res) => {
    const { user, items, totalAmount, paymentMethodId } = req.body;
    try {
        // Initialize Stripe with the secret key
        const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
        
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: totalAmount * 100, // cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        const order = new Order({
            user,
            items,
            totalAmount,
            status: 'Paid',
            paymentId: paymentIntent.id
        });
        await order.save();

        res.json({ message: 'Payment successful & order placed', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all orders (admin or user specific)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('items.artwork', 'title imageUrl');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .populate('items.artwork', 'title imageUrl');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
