const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, default: 'Other' },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: 'https://via.placeholder.com/300' },
  brand: String,
  rating: { type: Number, default: 5 },
  tags: [String],
  sku: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
