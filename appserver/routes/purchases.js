const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

// List purchases
router.get('/', async (req, res) => {
    const purchases = await Purchase.find().populate('customerId').populate('productId');
    res.json(purchases);
});

// Create purchase
router.post('/', async (req, res) => {
    const { customerId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (quantity > product.stock) return res.status(400).json({ error: 'Not enough stock' });

    product.stock -= quantity;
    await product.save();

    const purchase = new Purchase(req.body);
    await purchase.save();
    res.json(purchase);
});

// Update purchase
router.put('/:id', async (req, res) => {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(purchase);
});

// Delete purchase
router.delete('/:id', async (req, res) => {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;
