import React, { useState } from 'react';
import { 
  Plane, MapPin, Calendar, IndianRupee, Sparkles, 
  User, X, ArrowRight, Lock, CheckCircle2, Train,
  Car, Star, MessageSquare, Sun, Sunset, Moon, Building2, Compass, Receipt, Users, Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('home'); 
  const [activeNavTab, setActiveNavTab] = useState('Explore'); 
  
  // Login Form States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(null);

  // Planner Inputs
  const [source, setSource] = useState('Bhopal');
  const [destination, setDestination] = useState('Agra');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('15000');
  const [travelers, setTravelers] = useState('2');
  
  // App Processing States
  const [loading, setLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState(null);
  const [selectedDayTab, setSelectedDayTab] = useState('All Days');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste! I am your Wings AI Assistant. How can I help you plan your journey?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Popular Destination Preset Cards
  const popularTrips = [
    {
      name: 'Agra',
      title: 'Trip to Agra',
      subtitle: 'Taj Mahal & Mughal Heritage',
      days: '2',
      budget: '10000',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      tag: 'Historical'
    },
    {
      name: 'Goa',
      title: 'Trip to Goa',
      subtitle: 'Beaches, Nightlife & Shacks',
      days: '4',
      budget: '25000',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      tag: 'Relaxation'
    },
    {
      name: 'Manali',
      title: 'Trip to Manali',
      subtitle: 'Snowy Peaks & Solang Valley',
      days: '5',
      budget: '30000',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      tag: 'Adventure'
    },
    {
      name: 'Bali',
      title: 'Trip to Bali',
      subtitle: 'Tropical Paradise & Temples',
      days: '5',
      budget: '60000',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      tag: 'International'
    }
  ];

  // Dynamic Real-Time Location Image Engine
  const getLocationImage = (cityName) => {
    const city = (cityName || '').trim().toLowerCase();
    
    // Curated high-res mapping for key locations
    if (city.includes('agra')) return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('goa')) return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('manali') || city.includes('shimla')) return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('bali')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('jaipur') || city.includes('udaipur')) return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('mumbai')) return 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('delhi')) return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80';
    if (city.includes('paris')) return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80';
    
    // Fallback Dynamic Search URL for any city worldwide
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80`;
  };

  // Quick Card Selection Auto-Fill
  const selectQuickTrip = (trip) => {
    setDestination(trip.name);
    setDays(trip.days);
    setBudget(trip.budget);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Itinerary & Fare Calculation Engine with Detailed Step-by-Step Directions
  const generateTrip = async () => {
    if (!destination) {
      alert("Please enter a destination!");
      return;
    }

    const activeKey = import.meta.env.VITE_GROQ_API_KEY;
    setLoading(true);
    setItineraryData(null);

    const prompt = `Act as an expert AI Travel Planner named "Wings". Create a deeply detailed ${days}-day trip itinerary to ${destination} starting from ${source}.
Total Budget: ₹${budget} for ${travelers} travelers.

Respond ONLY with a valid raw JSON object matching this schema (NO markdown formatting, NO backticks, NO extra string wrapper):
{
  "title": "${days}-Day Detailed ${destination} Tour",
  "destination": "${destination}",
  "tags": ["${activeNavTab}", "step-by-step-guide", "budget-optimized"],
  "financialSummary": {
    "flightRoundTripPerPerson": ${Math.round((budget * 0.35) / travelers)},
    "trainRoundTripPerPerson": ${Math.round((budget * 0.15) / travelers)},
    "totalFlightGroupFare": ${Math.round(budget * 0.35)},
    "totalTrainGroupFare": ${Math.round(budget * 0.15)},
    "hotelStayTotal": ${Math.round(budget * 0.35)},
    "foodAndActivitiesTotal": ${Math.round(budget * 0.25)}
  },
  "transportToAndFro": [
    {
      "mode": "Flight (Round Trip To & Fro)",
      "duration": "2h - 4h per leg",
      "farePerPerson": "₹${Math.round((budget * 0.35) / travelers)}",
      "totalGroupFare": "₹${Math.round(budget * 0.35)}"
    },
    {
      "mode": "Express Train (Round Trip To & Fro)",
      "duration": "8h - 12h per leg",
      "farePerPerson": "₹${Math.round((budget * 0.15) / travelers)}",
      "totalGroupFare": "₹${Math.round(budget * 0.15)}"
    }
  ],
  "days": [
    {
      "dayNumber": 1,
      "theme": "Arrival, Hotel Check-in & Initial City Tour",
      "dayTotalCost": "₹${Math.round((budget * 0.30) / days)}",
      "morning": "[08:00 AM - 12:30 PM] Reach ${destination} from ${source}. Take an auto/cab to your hotel, complete check-in, refresh and enjoy breakfast nearby.",
      "afternoon": "[01:30 PM - 05:00 PM] Head to the first major spot in ${destination}. Explore the location, take photos, and try authentic local dishes at popular nearby restaurants.",
      "evening": "[05:30 PM - 09:30 PM] Travel to famous local night markets/sunset points. Enjoy street shopping, local snacks, and return to hotel for dinner.",
      "places": [
        {
          "name": "Famous Place 1 in ${destination}",
          "rating": "4.8",
          "driveTime": "~20 min drive from hotel",
          "description": "Comprehensive details on how to explore this location step-by-step.",
          "cost": "₹200 - ₹500 entry fee"
        }
      ]
    }
  ]
}`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let textResult = data.choices[0].message.content;
      const jsonMatch = textResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Format error. Click Plan Trip again!");

      const parsedData = JSON.parse(jsonMatch[0]);
      setItineraryData(parsedData);
      setSelectedDayTab('All Days');

      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

    } catch (err) {
      alert("Error generating trip: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chatbot Handler
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { sender: 'user', text: chatInput }];
    setChatMessages(newMessages);
    const query = chatInput;
    setChatInput('');

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: `Wings AI travel answer: ${query}` }]
        })
      });
      const data = await response.json();
      setChatMessages([...newMessages, { sender: 'bot', text: data.choices[0].message.content }]);
    } catch (e) {
      setChatMessages([...newMessages, { sender: 'bot', text: 'Connecting issue.' }]);
    }
  };

  // OTP Login Handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456' || otp.length === 6) {
      setUser({ phone: phoneNumber });
      setCurrentPage('home');
    } else {
      alert("Enter 6-digit OTP (Use 123456 for demo)");
    }
  };

  // Accurate Calculations for Single Person vs Group Total
  const singlePersonTotal = itineraryData?.financialSummary ? Math.round((
    itineraryData.financialSummary.totalFlightGroupFare + 
    itineraryData.financialSummary.hotelStayTotal + 
    itineraryData.financialSummary.foodAndActivitiesTotal
  ) / Number(travelers || 1)) : 0;

  const totalGroupExpenses = itineraryData?.financialSummary ? (
    itineraryData.financialSummary.totalFlightGroupFare + 
    itineraryData.financialSummary.hotelStayTotal + 
    itineraryData.financialSummary.foodAndActivitiesTotal
  ) : 0;

  // ==========================================
  // PAGE 2: LOGIN VIEW WITH OTP
  // ==========================================
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3.5 py-2 rounded-2xl font-black text-xl flex items-center gap-1 shadow-md">
              <span>Wings 🦋</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1">
            {!otpSent ? 'Login with Phone' : 'Enter Verification Code'}
          </h2>
          <p className="text-slate-500 text-xs mb-6">
            {!otpSent 
              ? 'Enter your mobile number to get a 6-digit OTP' 
              : `We sent a code to +91 ${phoneNumber}`}
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">+91</span>
                <input 
                  type="tel" 
                  maxLength={10}
                  placeholder="Mobile Number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500 font-bold text-slate-800 text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Get OTP <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6-digit OTP (Demo: 123456)" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500 font-bold tracking-widest text-slate-800 text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Verify & Login <CheckCircle2 className="w-4 h-4 text-pink-400" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE 1: MAIN HOMEPAGE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveNavTab('Explore')}>
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white px-3.5 py-1.5 rounded-2xl font-black text-xl flex items-center gap-1.5 shadow-md">
              <span>Wings 🦋</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-2 text-xs font-bold bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveNavTab('Explore')} 
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${activeNavTab === 'Explore' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Compass className="w-3.5 h-3.5"/> Explore
            </button>
            <button 
              onClick={() => setActiveNavTab('Hotels')} 
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${activeNavTab === 'Hotels' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Building2 className="w-3.5 h-3.5"/> Hotels
            </button>
            <button 
              onClick={() => setActiveNavTab('Flights')} 
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${activeNavTab === 'Flights' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Plane className="w-3.5 h-3.5"/> Flights
            </button>
          </nav>
        </div>

        <button 
          onClick={() => setCurrentPage('login')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-5 py-2 rounded-full font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          {user ? `+91 ${user.phone.slice(-4)}` : 'Sign In'}
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto mt-6 px-4">
        {/* Top Planner Input Box */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 mb-8 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-slate-50 rounded-2xl p-2.5 px-4 border border-slate-100">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase">From</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 text-sm outline-none" />
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 px-4 border border-slate-100">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase">To Destination</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 text-sm outline-none" placeholder="e.g. Agra, Goa, Bali" />
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 px-4 border border-slate-100">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Days / Guests</label>
            <div className="flex gap-2">
              <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-10 bg-transparent font-bold text-slate-800 text-sm outline-none" />
              <span className="text-slate-300">|</span>
              <input type="number" value={travelers} onChange={(e) => setTravelers(e.target.value)} className="w-10 bg-transparent font-bold text-slate-800 text-sm outline-none" />
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 px-4 border border-slate-100">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase">Budget (₹)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 text-sm outline-none" />
          </div>
          <button 
            onClick={generateTrip} 
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer py-3 md:py-0 disabled:opacity-50"
          >
            {loading ? 'Planning...' : '✨ Plan Trip'}
          </button>
        </div>

        {/* POPULAR TRIPS CARDS */}
        {!itineraryData && (
          <div className="my-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  Popular Handcrafted Trips
                </h2>
                <p className="text-slate-500 text-xs mt-1">Click any card below to instant-load details!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTrips.map((trip, idx) => (
                <div 
                  key={idx}
                  onClick={() => selectQuickTrip(trip)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 active:scale-95"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      {trip.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-pink-600 transition">{trip.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{trip.subtitle}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{trip.days} Days Plan</span>
                      <span className="text-pink-600">₹{trip.budget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Result View */}
        {itineraryData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR: Destination Image Engine & Map */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group">
                <img 
                  src={getLocationImage(itineraryData.destination)} 
                  alt={itineraryData.destination} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-pink-500/80 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {itineraryData.tags ? itineraryData.tags.join(' • ') : 'Wings Special'}
                  </span>
                  <h2 className="text-xl font-black mt-1">{itineraryData.title}</h2>
                  <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" /> {itineraryData.destination} • {days} Days Plan
                  </p>
                </div>
              </div>

              {/* Map View Frame */}
              <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="h-44 rounded-2xl overflow-hidden">
                  <iframe
                    title="Map"
                    width="100%"
                    height="100%"
                    className="border-0"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${itineraryData.destination}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>

              {/* Day Filter Pills */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex gap-2 overflow-x-auto">
                <button 
                  onClick={() => setSelectedDayTab('All Days')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedDayTab === 'All Days' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Days
                </button>
                {itineraryData.days && itineraryData.days.map((d) => (
                  <button 
                    key={d.dayNumber}
                    onClick={() => setSelectedDayTab(`Day ${d.dayNumber}`)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedDayTab === `Day ${d.dayNumber}` ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Day {d.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Transport Fare Section (Round Trip Flight & Train Options) */}
              {itineraryData.transportToAndFro && (
                <div className="bg-pink-50/60 border border-pink-100 rounded-3xl p-5">
                  <h3 className="text-xs font-black text-pink-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Plane className="w-4 h-4 text-pink-600" /> Round-Trip Transport Options ({source} ⇆ {destination})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {itineraryData.transportToAndFro.map((t, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                            {t.mode.includes('Flight') ? <Plane className="w-3.5 h-3.5 text-pink-500"/> : <Train className="w-3.5 h-3.5 text-purple-500"/>} 
                            {t.mode}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">Duration: {t.duration}</p>
                        <div className="pt-2 flex justify-between items-center border-t border-slate-100 text-xs">
                          <span className="text-slate-500 text-[10px]">Per Person: <b>{t.farePerPerson}</b></span>
                          <span className="font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">Total: {t.totalGroupFare}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-Wise Detailed Cards Timeline with Directions */}
              {itineraryData.days && itineraryData.days
                .filter(d => selectedDayTab === 'All Days' || selectedDayTab === `Day ${d.dayNumber}`)
                .map((dayPlan) => (
                  <div key={dayPlan.dayNumber} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <h3 className="text-base font-black text-slate-900">
                        Day {dayPlan.dayNumber}: {dayPlan.theme}
                      </h3>
                      <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {dayPlan.dayTotalCost}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {dayPlan.morning && (
                        <div className="flex gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100/80">
                          <Sun className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider">Morning Schedule & Route</h4>
                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{dayPlan.morning}</p>
                          </div>
                        </div>
                      )}

                      {dayPlan.afternoon && (
                        <div className="flex gap-3 bg-orange-50/50 p-3.5 rounded-2xl border border-orange-100/80">
                          <Sunset className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-xs text-orange-900 uppercase tracking-wider">Afternoon Sightseeing & Lunch Spot</h4>
                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{dayPlan.afternoon}</p>
                          </div>
                        </div>
                      )}

                      {dayPlan.evening && (
                        <div className="flex gap-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100/80">
                          <Moon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-xs text-purple-900 uppercase tracking-wider">Evening Experience & Dinner</h4>
                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{dayPlan.evening}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {dayPlan.places && dayPlan.places.length > 0 && (
                      <div className="space-y-3 pt-2">
                        {dayPlan.places.map((place, pIdx) => (
                          <div key={pIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4">
                            <img 
                              src={getLocationImage(itineraryData.destination)} 
                              alt={place.name} 
                              className="w-16 h-16 rounded-xl object-cover" 
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                  <Navigation className="w-3.5 h-3.5 text-pink-500"/> {place.name}
                                </h4>
                                <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-500"/> {place.rating}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{place.description}</p>
                              <div className="flex gap-4 mt-2 text-[11px] font-bold">
                                <span className="text-pink-600">Ticket: {place.cost}</span>
                                <span className="text-slate-400">• {place.driveTime}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

              {/* SINGLE vs TOTAL GROUP PERSON EXPENSE BREAKDOWN */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-black text-pink-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Receipt className="w-4 h-4" /> Total Estimated Expenses Breakdown
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Single Person Calculation */}
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-slate-400 text-xs font-bold flex items-center gap-1"><User className="w-3.5 h-3.5"/> Per Person Expense</p>
                      <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-md font-bold">1 Pax</span>
                    </div>
                    <p className="text-2xl font-black text-white mt-2">₹{singlePersonTotal || Math.round(budget / travelers)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Includes per-head transport, hotel stay & activities</p>
                  </div>

                  {/* Total Group / Double Person Calculation */}
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-slate-400 text-xs font-bold flex items-center gap-1"><Users className="w-3.5 h-3.5"/> Total Group Expense</p>
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-bold">{travelers} Travelers</span>
                    </div>
                    <p className="text-2xl font-black text-green-400 mt-2">₹{totalGroupExpenses || budget}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Round trip travel, hotel accommodation & local passes</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Floating AI Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button 
            onClick={() => setChatOpen(true)} 
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-5 py-3.5 rounded-full shadow-2xl transition transform hover:scale-105 flex items-center gap-2 font-bold text-sm cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>AI Help</span>
          </button>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[450px] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex justify-between items-center font-bold text-sm">
              <span className="flex items-center gap-2">Wings AI Help</span>
              <button onClick={() => setChatOpen(false)} className="cursor-pointer"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-pink-500 text-white ml-auto' : 'bg-white text-slate-800 border border-slate-200 mr-auto shadow-sm'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-3 bg-white border-t flex gap-2">
              <input type="text" placeholder="Ask Wings AI..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-pink-500" />
              <button onClick={handleSendMessage} className="bg-pink-500 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
