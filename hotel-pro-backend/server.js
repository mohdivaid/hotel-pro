const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// In-Memory Database Store
let rooms = [
  { 
    roomId: '101', 
    type: 'Royal Imperial Penthouse', 
    price: 25000, 
    status: 'Occupied', 
    guest: 'Rajesh Singhania', 
    cleaning: 'Clean',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    sqft: '1,450 sq ft',
    rating: '5.0 ★'
  },
  { 
    roomId: '102', 
    type: 'Executive Burgundy Suite', 
    price: 15500, 
    status: 'Available', 
    guest: '-', 
    cleaning: 'Clean',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    sqft: '980 sq ft',
    rating: '4.9 ★'
  },
  { 
    roomId: '103', 
    type: 'Deluxe Grand Heritage', 
    price: 9500, 
    status: 'Cleaning', 
    guest: '-', 
    cleaning: 'Needs Housekeeping',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    sqft: '720 sq ft',
    rating: '4.8 ★'
  },
  { 
    roomId: '104', 
    type: 'Presidential Velvet Suite', 
    price: 35000, 
    status: 'Reserved', 
    guest: 'Vikramaditya Roy', 
    cleaning: 'Clean',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    sqft: '2,100 sq ft',
    rating: '5.0 ★'
  },
  { 
    roomId: '105', 
    type: 'Executive Ocean View', 
    price: 18500, 
    status: 'Available', 
    guest: '-', 
    cleaning: 'Clean',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    sqft: '1,100 sq ft',
    rating: '4.9 ★'
  },
  { 
    roomId: '106', 
    type: 'Royal Imperial Penthouse', 
    price: 25000, 
    status: 'Occupied', 
    guest: 'Ananya Sharma', 
    cleaning: 'Clean',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    sqft: '1,450 sq ft',
    rating: '5.0 ★'
  }
];

// API 1: Fetch All Rooms
app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// API 2: Express New Guest Check-in
app.post('/api/rooms/checkin', (req, res) => {
  const { roomId, type, price, guest } = req.body;
  
  const existingIndex = rooms.findIndex(r => r.roomId === roomId);
  
  if (existingIndex !== -1) {
    rooms[existingIndex] = {
      ...rooms[existingIndex],
      status: 'Occupied',
      guest: guest,
      cleaning: 'Clean'
    };
    return res.json({ message: "Check-in Updated!", room: rooms[existingIndex] });
  }

  const newRoom = {
    roomId,
    type,
    price: Number(price),
    status: 'Occupied',
    guest,
    cleaning: 'Clean',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    sqft: '1,100 sq ft',
    rating: '5.0 ★'
  };

  rooms.unshift(newRoom);
  res.json({ message: "Check-in Successful!", room: newRoom });
});

// API 3: Toggle Housekeeping
app.put('/api/rooms/:roomId/housekeeping', (req, res) => {
  const room = rooms.find(r => r.roomId === req.params.roomId);
  if (!room) return res.status(404).json({ error: "Room not found" });

  const nextCleaning = room.cleaning === 'Clean' ? 'Needs Housekeeping' : 'Clean';
  room.cleaning = nextCleaning;
  
  if (nextCleaning === 'Needs Housekeeping') {
    room.status = 'Cleaning';
  } else if (room.status === 'Cleaning') {
    room.status = 'Available';
  }

  res.json({ message: "Housekeeping status updated", room });
});

// API 4: Guest Checkout
app.put('/api/rooms/:roomId/checkout', (req, res) => {
  const room = rooms.find(r => r.roomId === req.params.roomId);
  if (!room) return res.status(404).json({ error: "Room not found" });

  room.status = 'Available';
  room.guest = '-';
  room.cleaning = 'Needs Housekeeping';

  res.json({ message: "Checkout completed successfully", room });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hotel Pro Server active on http://localhost:${PORT}`);
});