import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

// Generate 10 Floors with 5 Rooms Each (Total 50 Rooms with Floor-wise Pricing)
const generateTajRooms = () => {
  const roomsList = [];
  const roomTypes = [
    { name: 'Deluxe City View', multiplier: 1, baseSqft: '650 sq ft' },
    { name: 'Executive Club Room', multiplier: 1.3, baseSqft: '850 sq ft' },
    { name: 'Grand Luxury Suite', multiplier: 1.8, baseSqft: '1,200 sq ft' },
    { name: 'Royal Heritage Suite', multiplier: 2.5, baseSqft: '1,650 sq ft' },
    { name: 'Taj Presidential Penthouse', multiplier: 3.8, baseSqft: '2,500 sq ft' }
  ];

  const roomImages = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
  ];

  for (let floor = 1; floor <= 10; floor++) {
    for (let r = 1; r <= 5; r++) {
      const roomNumber = `${floor}${r < 10 ? '0' + r : r}`;
      
      let categoryIndex = 0;
      if (floor >= 3 && floor <= 4) categoryIndex = 1;
      else if (floor >= 5 && floor <= 7) categoryIndex = 2;
      else if (floor >= 8 && floor <= 9) categoryIndex = 3;
      else if (floor === 10) categoryIndex = 4;

      const category = roomTypes[categoryIndex];
      const calculatedPrice = Math.round((8000 + (floor * 1200)) * category.multiplier);

      roomsList.push({
        roomId: roomNumber,
        floor: floor,
        type: `Floor ${floor} - ${category.name}`,
        categoryName: category.name,
        price: calculatedPrice,
        status: (floor === 1 && r === 1) || (floor === 5 && r === 3) || (floor === 10 && r === 5) ? 'Occupied' : 'Available',
        guest: (floor === 1 && r === 1) ? 'Rajesh Sharma' : (floor === 5 && r === 3) ? 'Vikram Malhotra' : (floor === 10 && r === 5) ? 'Ananya Singhania' : '-',
        cleaning: (floor === 2 && r === 4) ? 'Needs Housekeeping' : 'Clean',
        image: roomImages[(r - 1) % roomImages.length],
        sqft: category.baseSqft,
        rating: floor === 10 ? '5.0 ★ Royal VIP' : '4.9 ★'
      });
    }
  }
  return roomsList;
};

const defaultTajRooms = generateTajRooms();

const suiteGalleries = {
  'Deluxe City View': [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
  ],
  'Executive Club Room': [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  ],
  'Grand Luxury Suite': [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
  ],
  'Royal Heritage Suite': [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  ],
  'Taj Presidential Penthouse': [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  ]
};

export default function TajHotelApp() {
  const [role, setRole] = useState('Guest'); 
  const [rooms, setRooms] = useState(defaultTajRooms);
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedGalleryRoom, setSelectedGalleryRoom] = useState(null); 
  const [activeGalleryImage, setActiveGalleryImage] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    type: 'Floor 1 - Deluxe City View',
    price: '9200',
    guest: ''
  });

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setRooms(data);
        }
      }
    } catch (err) {
      console.log("Backend API offline, utilizing Taj Indore 10-Floor inventory.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-950/90 text-emerald-400 border-emerald-800/60';
      case 'Occupied': return 'bg-rose-950/90 text-rose-300 border-rose-800/60';
      case 'Cleaning': return 'bg-amber-950/90 text-amber-300 border-amber-800/60';
      case 'Reserved': return 'bg-purple-950/90 text-purple-300 border-purple-800/60';
      default: return 'bg-zinc-900 text-zinc-400';
    }
  };

  const openRoomGallery = (room) => {
    const galleryImages = suiteGalleries[room.categoryName] || [room.image];
    setSelectedGalleryRoom({ ...room, gallery: galleryImages });
    setActiveGalleryImage(galleryImages[0]);
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.guest) {
      alert("Please enter Room Number and Guest Name!");
      return;
    }

    const updatedRooms = rooms.map(r => 
      r.roomId === formData.id 
        ? { ...r, status: 'Occupied', guest: formData.guest, cleaning: 'Clean' } 
        : r
    );

    if (!rooms.some(r => r.roomId === formData.id)) {
      updatedRooms.unshift({
        roomId: formData.id,
        floor: 1,
        type: formData.type,
        categoryName: 'Deluxe City View',
        price: Number(formData.price),
        status: 'Occupied',
        guest: formData.guest,
        cleaning: 'Clean',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        sqft: '850 sq ft',
        rating: '5.0 ★'
      });
    }

    setRooms(updatedRooms);
    setIsModalOpen(false);
    setSelectedGalleryRoom(null);
    setFormData({ id: '', type: 'Floor 1 - Deluxe City View', price: '9200', guest: '' });

    try {
      await fetch(`${API_BASE_URL}/rooms/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: formData.id,
          type: formData.type,
          price: Number(formData.price),
          guest: formData.guest
        })
      });
    } catch (err) {
      console.log("Checkin saved locally.");
    }
  };

  const toggleCleaningStatus = async (roomId) => {
    setRooms(rooms.map(r => {
      if (r.roomId === roomId) {
        const nextCleaning = r.cleaning === 'Clean' ? 'Needs Housekeeping' : 'Clean';
        return {
          ...r,
          cleaning: nextCleaning,
          status: nextCleaning === 'Needs Housekeeping' ? 'Cleaning' : (r.status === 'Cleaning' ? 'Available' : r.status)
        };
      }
      return r;
    }));

    try {
      await fetch(`${API_BASE_URL}/rooms/${roomId}/housekeeping`, { method: 'PUT' });
    } catch (err) {
      console.log("Status updated locally.");
    }
  };

  const handleCheckout = async (roomId) => {
    setRooms(rooms.map(r => r.roomId === roomId ? { ...r, status: 'Available', guest: '-', cleaning: 'Needs Housekeeping' } : r));
    try {
      await fetch(`${API_BASE_URL}/rooms/${roomId}/checkout`, { method: 'PUT' });
    } catch (err) {
      console.log("Checkout done locally.");
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesFloor = selectedFloor === 'All' || r.floor === Number(selectedFloor);
    const matchesSearch = 
      (r.roomId && r.roomId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.guest && r.guest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.type && r.type.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFloor && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      {role !== 'Guest' && (
        <aside className="w-64 bg-[#0d070a] border-r border-rose-950/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 via-amber-600 to-rose-900 rounded-xl text-zinc-950 font-black text-xl shadow-lg border border-amber-400/40">
                ★
              </div>
              <div>
                <h1 className="text-xl font-black tracking-widest text-amber-400 uppercase leading-none">TAJ HOTEL</h1>
                <p className="text-[10px] text-rose-300/70 tracking-widest uppercase mt-1">Indore Estate</p>
              </div>
            </div>

            <nav className="space-y-2">
              {['Dashboard', 'Room Status', 'Bookings', 'Billing & GST'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === item
                      ? 'bg-gradient-to-r from-rose-900/90 via-rose-950 to-zinc-950 text-amber-300 border border-rose-700/50 shadow-lg font-bold'
                      : 'text-zinc-400 hover:bg-rose-950/30 hover:text-zinc-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-rose-950/40 pt-4">
            <p className="text-xs font-semibold text-rose-300">{role} Access Active</p>
            <p className="text-[10px] text-zinc-500">Taj Indore Concierge Portal</p>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-[#0d070a]/90 border-b border-rose-950/40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-zinc-100 tracking-wide">
              {role === 'Guest' ? 'Taj Hotel Indore' : activeTab}
            </h2>
            {role !== 'Guest' && (
              <span className="text-[11px] px-3 py-0.5 rounded-full bg-rose-950/60 text-amber-300 border border-rose-800/40 font-semibold tracking-wider uppercase">
                ★ 50 Luxury Suites • 10 Floors
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#09090b] p-1.5 rounded-2xl border border-rose-950/60">
            <span className="text-xs text-rose-300/70 pl-2 pr-1 font-medium">Portal:</span>
            {['Admin', 'Staff', 'Guest'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`text-xs px-4 py-2 rounded-xl transition-all font-bold ${
                  role === r
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-[#0f0a0d] via-[#09090b] to-[#09090b]">
          
          {/* BANNER */}
          <div className="relative rounded-3xl overflow-hidden border border-rose-900/50 shadow-2xl h-72 mb-8 group">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80" 
              alt="Taj Hotel Indore Grand Building" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#0f0a0d]/80 to-transparent flex flex-col justify-center p-10">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-rose-950/90 px-3.5 py-1 rounded-full border border-amber-500/40 w-fit mb-3">
                ★ Taj Hotel Indore • Iconic 10-Story Landmark
              </span>
              <h1 className="text-4xl font-black text-zinc-100 tracking-wider">Taj Hotel Indore</h1>
              <p className="text-zinc-300 text-xs mt-2 max-w-xl leading-relaxed">
                50 Ultra-Luxury Suites spread across 10 Floors with dedicated floor butler service, rooftop pool, and authentic fine dining.
              </p>
            </div>
          </div>

          {/* FLOOR FILTER BUTTONS */}
          <div className="mb-8 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Filter By Building Floor:</span>
              <span className="text-xs text-rose-300/60 font-medium">5 Rooms per Floor (Total 50 Rooms)</span>
            </div>
            <div className="flex flex-wrap gap-2 bg-[#0d070a] p-2 rounded-2xl border border-rose-950/60">
              <button
                onClick={() => setSelectedFloor('All')}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedFloor === 'All'
                    ? 'bg-amber-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-rose-950/40'
                }`}
              >
                All 10 Floors (50 Rooms)
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFloor(f)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                    selectedFloor === f
                      ? 'bg-gradient-to-r from-rose-900 to-rose-950 text-amber-300 border border-rose-700/60 shadow'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-rose-950/30'
                  }`}
                >
                  Floor {f}
                </button>
              ))}
            </div>
          </div>

          {/* GUEST PORTAL SUITE CATALOGUE */}
          {role === 'Guest' && (
            <div className="max-w-6xl mx-auto space-y-8 pb-10">
              <div className="flex justify-between items-end border-b border-rose-950/40 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-zinc-100 tracking-wide">
                    {selectedFloor === 'All' ? 'Showing All 10 Floors' : `Floor ${selectedFloor} Suites`}
                  </h3>
                  <p className="text-xs text-rose-300/60 mt-1">Higher floor suites offer panoramic Indore skyline views</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-900/40">
                  Showing {filteredRooms.length} Rooms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredRooms.map((room) => (
                  <div key={room.roomId} className="bg-[#0f0a0d] rounded-2xl border border-rose-950/60 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-2xl group">
                    <div>
                      <div 
                        onClick={() => openRoomGallery(room)}
                        className="relative h-56 overflow-hidden cursor-pointer group/img"
                      >
                        <img 
                          src={room.image} 
                          alt={room.type} 
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60 group-hover/img:opacity-30 transition-opacity" />
                        
                        <div className="absolute top-3 left-3 bg-[#09090b]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-400 text-xs font-black border border-rose-900/40">
                          Room #{room.roomId}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border shadow-md ${getStatusBadge(room.status)}`}>
                            {room.status}
                          </span>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                          <span className="bg-amber-500 text-zinc-950 font-black text-xs px-4 py-2 rounded-xl shadow-xl border border-amber-400">
                            🔍 View Gallery & Floor Details
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex justify-between items-center text-xs text-rose-300/70 font-semibold">
                          <span className="bg-rose-950/80 px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold border border-rose-800/40">
                            Floor {room.floor}
                          </span>
                          <span>{room.sqft}</span>
                        </div>
                        <h4 
                          onClick={() => openRoomGallery(room)}
                          className="font-black text-lg text-zinc-100 cursor-pointer hover:text-amber-400 transition-colors"
                        >
                          {room.type}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5 border-t border-rose-950/40 flex justify-between items-center bg-[#09090b]/60">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-semibold">Floor Tariff / Night</p>
                        <p className="text-lg font-black text-amber-400">₹{room.price ? room.price.toLocaleString() : 0}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openRoomGallery(room)}
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-900/60 text-rose-300 hover:bg-rose-950/40 transition-all"
                        >
                          Gallery
                        </button>
                        <button 
                          disabled={room.status !== 'Available'}
                          onClick={() => {
                            setFormData({ ...formData, id: room.roomId, type: room.type, price: room.price });
                            setIsModalOpen(true);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            room.status === 'Available'
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:bg-amber-400 shadow-md font-black'
                              : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                          }`}
                        >
                          {room.status === 'Available' ? 'Book Room' : 'Occupied'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMIN & STAFF PORTAL VIEWS */}
          {role !== 'Guest' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              
              <div className="flex flex-wrap justify-between items-center gap-4">
                <input 
                  type="text" 
                  placeholder="Search Room Number (e.g. 101 to 1005), Guest, or Floor..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-md bg-[#0f0a0d] border border-rose-950/60 px-4 py-3 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all"
                />

                {role === 'Admin' && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-800 text-zinc-950 px-6 py-3 rounded-xl font-black shadow-lg hover:opacity-90 transition-all text-sm uppercase tracking-wider"
                  >
                    + Express Check-in
                  </button>
                )}
              </div>

              {activeTab === 'Dashboard' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#0f0a0d] p-6 rounded-2xl border border-rose-950/60 shadow-xl">
                      <p className="text-xs font-semibold text-rose-300/60 uppercase tracking-wider">Total Building Inventory</p>
                      <h3 className="text-3xl font-black text-zinc-100 mt-2">{rooms.length} Rooms (10 Floors)</h3>
                    </div>
                    <div className="bg-[#0f0a0d] p-6 rounded-2xl border border-rose-950/60 shadow-xl">
                      <p className="text-xs font-semibold text-rose-300/60 uppercase tracking-wider">Occupied Suites</p>
                      <h3 className="text-3xl font-black text-rose-400 mt-2">{rooms.filter(r => r.status === 'Occupied').length}</h3>
                    </div>
                    <div className="bg-[#0f0a0d] p-6 rounded-2xl border border-rose-950/60 shadow-xl">
                      <p className="text-xs font-semibold text-rose-300/60 uppercase tracking-wider">Ready Available</p>
                      <h3 className="text-3xl font-black text-emerald-400 mt-2">{rooms.filter(r => r.status === 'Available').length}</h3>
                    </div>
                    <div className="bg-[#0f0a0d] p-6 rounded-2xl border border-rose-950/60 shadow-xl">
                      <p className="text-xs font-semibold text-rose-300/60 uppercase tracking-wider">Daily Projected Revenue</p>
                      <h3 className="text-3xl font-black text-amber-400 mt-2">
                        ₹{rooms.filter(r => r.status === 'Occupied').reduce((sum, r) => sum + r.price, 0).toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-[#0f0a0d] rounded-2xl border border-rose-950/60 shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-rose-950/40 flex justify-between items-center bg-[#09090b]/40">
                      <h3 className="font-bold text-zinc-100 text-lg">Taj Indore 10-Floor Inventory Matrix</h3>
                      <span className="text-xs text-rose-300/60 font-medium">Showing {filteredRooms.length} Rooms</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#09090b] text-xs font-semibold text-rose-300/70 uppercase tracking-wider border-b border-rose-950/40">
                          <th className="p-4">Preview</th>
                          <th className="p-4">Room No</th>
                          <th className="p-4">Building Floor</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price / Night</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Housekeeping</th>
                          <th className="p-4">Guest Name</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-950/30 text-sm">
                        {filteredRooms.map((room) => (
                          <tr key={room.roomId} className="hover:bg-rose-950/20 transition-all">
                            <td className="p-4">
                              <img 
                                onClick={() => openRoomGallery(room)}
                                src={room.image} 
                                alt={room.type} 
                                className="w-14 h-10 object-cover rounded-lg border border-rose-950/60 shadow cursor-pointer hover:scale-105 transition-transform" 
                              />
                            </td>
                            <td className="p-4 font-black text-amber-400">#{room.roomId}</td>
                            <td className="p-4 font-bold text-rose-300/80">Floor {room.floor}</td>
                            <td className="p-4 font-semibold text-zinc-200">{room.categoryName || room.type}</td>
                            <td className="p-4 font-bold text-zinc-100">₹{room.price ? room.price.toLocaleString() : 0}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(room.status)}`}>
                                {room.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <button 
                                onClick={() => toggleCleaningStatus(room.roomId)}
                                className={`text-xs px-3 py-1 rounded-lg border font-bold transition-all ${
                                  room.cleaning === 'Clean' 
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40' 
                                    : 'bg-amber-950 text-amber-300 border-amber-800/40'
                                }`}
                              >
                                {room.cleaning}
                              </button>
                            </td>
                            <td className="p-4 text-zinc-300 font-medium">{room.guest}</td>
                            <td className="p-4 text-right">
                              {room.status === 'Occupied' ? (
                                <button 
                                  onClick={() => handleCheckout(room.roomId)}
                                  className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/50 px-3 py-1.5 rounded-lg font-bold transition-all"
                                >
                                  Checkout
                                </button>
                              ) : (
                                <span className="text-xs text-zinc-600 font-medium">Vacant</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* HOUSEKEEPING TAB */}
              {activeTab === 'Room Status' && (
                <div className="bg-[#0f0a0d] p-8 rounded-2xl border border-rose-950/60 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold text-zinc-100">Taj Housekeeping & Floor Monitoring</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredRooms.map(r => (
                      <div key={r.roomId} className="bg-[#09090b] rounded-xl border border-rose-950/50 overflow-hidden shadow-lg">
                        <img src={r.image} alt={r.type} className="w-full h-36 object-cover cursor-pointer" onClick={() => openRoomGallery(r)} />
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-amber-400">Room #{r.roomId} (Floor {r.floor})</span>
                            <span className={`text-xs px-2 py-0.5 rounded border font-bold ${getStatusBadge(r.status)}`}>{r.status}</span>
                          </div>
                          <p className="text-xs text-zinc-400">{r.type}</p>
                          <div className="border-t border-rose-950/40 pt-3 flex justify-between items-center">
                            <span className="text-xs text-rose-300/70 font-semibold">{r.cleaning}</span>
                            <button 
                              onClick={() => toggleCleaningStatus(r.roomId)}
                              className="text-xs bg-rose-950 hover:bg-rose-900 text-amber-300 px-3 py-1 rounded-lg font-bold border border-rose-800/40"
                            >
                              Toggle Status
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOOKINGS TAB */}
              {activeTab === 'Bookings' && (
                <div className="bg-[#0f0a0d] p-8 rounded-2xl border border-rose-950/60 shadow-xl space-y-4">
                  <h3 className="text-xl font-bold text-zinc-100">Taj Indore Reservations Log</h3>
                  <div className="divide-y divide-rose-950/40">
                    {filteredRooms.map(r => (
                      <div key={r.roomId} className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={r.image} alt={r.type} className="w-14 h-14 object-cover rounded-xl border border-rose-950/60 cursor-pointer" onClick={() => openRoomGallery(r)} />
                          <div>
                            <p className="font-bold text-zinc-200">Guest: {r.guest !== '-' ? r.guest : 'Open Inventory'}</p>
                            <p className="text-xs text-rose-300/60">Room #{r.roomId} • Floor {r.floor} • {r.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-400">₹{r.price ? r.price.toLocaleString() : 0}</p>
                          <span className="text-xs text-emerald-400 font-semibold">Confirmed Booking</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BILLING & GST TAB */}
              {activeTab === 'Billing & GST' && (
                <div className="bg-[#0f0a0d] p-8 rounded-2xl border border-rose-950/60 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold text-zinc-100">Taj Tax Generator (18% Luxury GST)</h3>
                  <div className="space-y-4">
                    {filteredRooms.filter(r => r.status === 'Occupied').map(r => {
                      const gst = r.price * 0.18;
                      const total = r.price + gst;
                      return (
                        <div key={r.roomId} className="bg-[#09090b] p-5 rounded-xl border border-rose-950/50 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <img src={r.image} alt={r.type} className="w-14 h-14 object-cover rounded-xl border border-rose-950/60 cursor-pointer" onClick={() => openRoomGallery(r)} />
                            <div>
                              <p className="font-bold text-zinc-200">Room #{r.roomId} (Floor {r.floor}) - {r.guest}</p>
                              <p className="text-xs text-zinc-500">Base Tariff: ₹{r.price.toLocaleString()} + GST (18%): ₹{gst.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-amber-400">Total: ₹{total.toLocaleString()}</p>
                            <button 
                              onClick={() => setSelectedInvoice({ ...r, gst, total })}
                              className="text-xs bg-amber-500 text-zinc-950 px-3 py-1 rounded-lg font-bold mt-1 hover:bg-amber-400"
                            >
                              View GST Receipt
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* MULTI-PHOTO ROOM GALLERY MODAL */}
      {selectedGalleryRoom && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex justify-center items-center z-50 p-6">
          <div className="bg-[#0f0a0d] rounded-3xl shadow-2xl w-full max-w-4xl border border-rose-900/60 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            <div className="md:w-3/5 p-6 space-y-4 bg-[#09090b] flex flex-col justify-between">
              <div className="relative h-80 rounded-2xl overflow-hidden border border-rose-950">
                <img src={activeGalleryImage} alt="Suite Detail" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#09090b]/80 px-3 py-1 rounded-lg text-amber-400 text-xs font-black">
                  Room #{selectedGalleryRoom.roomId} • Floor {selectedGalleryRoom.floor}
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedGalleryRoom.gallery.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt="Thumbnail"
                    onClick={() => setActiveGalleryImage(imgUrl)}
                    className={`w-20 h-16 object-cover rounded-xl border-2 cursor-pointer transition-all ${
                      activeGalleryImage === imgUrl ? 'border-amber-400 scale-105' : 'border-rose-950/60 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="md:w-2/5 p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-800/40">
                      ★ Taj Hotel Indore
                    </span>
                    <h3 className="text-2xl font-black text-zinc-100 mt-2">{selectedGalleryRoom.type}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedGalleryRoom(null)} 
                    className="text-zinc-500 hover:text-zinc-200 font-bold text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-3 text-xs text-zinc-300">
                  <div className="flex justify-between border-b border-rose-950/60 pb-2">
                    <span className="text-rose-300/60">Floor Level:</span>
                    <span className="font-bold text-amber-400">Floor {selectedGalleryRoom.floor} of 10</span>
                  </div>
                  <div className="flex justify-between border-b border-rose-950/60 pb-2">
                    <span className="text-rose-300/60">Carpet Area:</span>
                    <span className="font-bold text-zinc-100">{selectedGalleryRoom.sqft}</span>
                  </div>
                  <div className="flex justify-between border-b border-rose-950/60 pb-2">
                    <span className="text-rose-300/60">Guest Rating:</span>
                    <span className="font-bold text-amber-400">{selectedGalleryRoom.rating}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-rose-950/60 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Tariff / Night</p>
                  <p className="text-2xl font-black text-amber-400">₹{selectedGalleryRoom.price ? selectedGalleryRoom.price.toLocaleString() : 0}</p>
                </div>

                <button 
                  disabled={selectedGalleryRoom.status !== 'Available'}
                  onClick={() => {
                    setFormData({ ...formData, id: selectedGalleryRoom.roomId, type: selectedGalleryRoom.type, price: selectedGalleryRoom.price });
                    setSelectedGalleryRoom(null);
                    setIsModalOpen(true);
                  }}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                    selectedGalleryRoom.status === 'Available'
                      ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-800 text-zinc-950 hover:opacity-90 shadow-lg'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                >
                  {selectedGalleryRoom.status === 'Available' ? 'Reserve Room' : 'Occupied'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CHECK-IN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-[#0f0a0d] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-rose-900/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-zinc-100">Reserve Taj Indore Suite</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-200 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-300/70 uppercase mb-1">Room Number (e.g. 101 to 1005)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 101" 
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  className="w-full bg-[#09090b] border border-rose-950/80 p-3 rounded-xl text-zinc-200 focus:border-amber-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300/70 uppercase mb-1">Guest Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter guest name" 
                  value={formData.guest}
                  onChange={(e) => setFormData({...formData, guest: e.target.value})}
                  className="w-full bg-[#09090b] border border-rose-950/80 p-3 rounded-xl text-zinc-200 focus:border-amber-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-rose-950 text-zinc-400 hover:bg-rose-950/30 text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-black hover:bg-amber-400 text-xs uppercase"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GST INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-[#09090b]/90 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-[#0f0a0d] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-rose-900/60 space-y-4">
            <div className="border-b border-rose-950/60 pb-4 text-center">
              <h3 className="text-xl font-black text-amber-400 uppercase tracking-widest">Taj Hotel Indore</h3>
              <p className="text-[10px] text-rose-300/60 uppercase tracking-wider mt-1">Official Tax Invoice</p>
            </div>
            
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex justify-between">
                <span>Guest Name:</span>
                <span className="font-bold text-zinc-100">{selectedInvoice.guest}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Number:</span>
                <span className="font-bold text-amber-400">#{selectedInvoice.roomId} (Floor {selectedInvoice.floor})</span>
              </div>
              <div className="flex justify-between">
                <span>Room Tariff:</span>
                <span>₹{selectedInvoice.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-300/80">
                <span>GST (18%):</span>
                <span>₹{selectedInvoice.gst.toLocaleString()}</span>
              </div>
              <div className="border-t border-rose-950/60 pt-2 flex justify-between font-black text-lg text-amber-400">
                <span>Total Amount:</span>
                <span>₹{selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-rose-950 text-rose-300 hover:bg-rose-900 text-xs font-bold border border-rose-800/40"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}