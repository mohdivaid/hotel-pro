const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Occupied', 'Cleaning', 'Reserved'], default: 'Available' },
  guest: { type: String, default: '-' },
  cleaning: { type: String, enum: ['Clean', 'Needs Housekeeping'], default: 'Clean' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  sqft: { type: String, default: '1,000 sq ft' },
  rating: { type: String, default: '5.0 ★' }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);