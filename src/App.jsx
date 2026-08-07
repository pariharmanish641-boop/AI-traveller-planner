import React, { useState } from 'react';
import { 
  Plane, Building2, Train, Bus, Sparkles, MapPin, 
  Calendar, IndianRupee, Compass, Landmark, Utensils, Trees, 
  Search, UserCheck, User, MessageSquareBot, X, ExternalLink, Download, LogIn, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';

export default function App() {
  // Application State
  const [source, setSource] = useState('Bhopal');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('15000');
  const [travelers, setTravelers] = useState('2');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // API & Auth States
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  
  // App Processing States
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste! I am your AI Travel Assistant. How can I help you plan your vacation today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Sample Featured Locations Data
  const popularDestinations = [
    {
      id: 1,
      title: "Agra - Taj Mahal",
      category: "Historical",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
      description: "Iconic white marble mausoleum and symbol of true love.",
      mapUrl: "https://www.google.com/maps/place/Taj+Mahal",
      wikiUrl: "https://en.wikipedia.org/wiki/Taj_Mahal"
    },
    {
      id: 2,
      title: "Goa - Baga Beach",
      category: "Nature",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      description: "Famous for nightlife, beach shacks, and exhilarating water sports.",
      mapUrl: "https://www.google.com/maps/place/Baga+Beach",
      wikiUrl: "https://en.wikipedia.org/wiki/Baga,_Goa"
    },
    {
      id: 3,
      title: "Jaipur - Amber Fort",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      description: "Majestic hilltop fort known for Hindu-style artistic elements.",
      mapUrl: "https://www.google.com/maps/place/Amber+Palace",
      wikiUrl: "https://en.wikipedia.org/wiki/Amer_Fort"
    }
  ];

  const categories = [
    { name: 'All', icon: Compass },
    { name: 'Religious', icon: Landmark },
    { name: 'Cultural', icon: Compass },
    { name: 'Nature', icon: Trees },
    { name: 'Food', icon: Utensils },
    { name: 'Historical', icon: Landmark },
  ];

  // AI Itinerary Generation
  const generateTrip = async () => {
    if (!destination) {
      alert("Please enter a destination city!");
      return;
    }

    const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!activeKey) {
      alert("Please set your Gemini API Key in the top right menu!");
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    setItinerary('');

    const prompt = `Act as an expert AI Travel Planner like Ixigo. Plan a detailed ${days}-day itinerary to ${destination} starting from ${source}.
Budget: ₹${budget} total for ${travelers} travelers.
Category preference: ${selectedCategory}.

Provide a clear and well-formatted day-wise breakdown including:
- Morning, Afternoon, Evening Activities
- Recommended Stays & Budget Hotels
- Famous Food & Local Restaurants
- Estimated Cost Breakdown (Travel, Food, Sightseeing)`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const textResult = data.candidates[0].content.parts[0].text;
      setItinerary(textResult);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

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

    const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!activeKey) {
      setChatMessages([...newMessages, { sender: 'bot', text: 'Please set your Gemini API key in the top navbar to enable live AI responses.' }]);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Answer as a helpful travel assistant concisely: ${query}` }] }]
          })
        }
      );

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;
      setChatMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (e) {
      setChatMessages([...newMessages, { sender: 'bot', text: 'Sorry, I encountered an issue fetching the response.' }]);
    }
  };

  // PDF Export Function
  const exportPDF = () => {
    const element = document.getElementById('itinerary-content');
    if (!element) return;
    html2pdf().from(element).save(`${destination}_Itinerary.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 relative">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-12 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-xl font-bold text-xl flex items-center gap-1.5 shadow-md">
              <Plane className="w-6 h-6 rotate-45" />
              <span>ixigo</span>
              <span className="bg-white text-orange-600 text-xs px-1.5 py-0.5 rounded-md uppercase font-extrabold ml-1">AI</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 hover:text-orange-600 cursor-pointer text-orange-600"><Plane className="w-4 h-4"/> Flights</span>
            <span className="flex items-center gap-1.5 hover:text-orange-600 cursor-pointer"><Building2 className="w-4 h-4"/> Hotels</span>
            <span className="flex items-center gap-1.5 hover:text-orange-600 cursor-pointer"><Train className="w-4 h-4"/> Trains</span>
            <span className="flex items-center gap-1.5 hover:text-orange-600 cursor-pointer"><Bus className="w-4 h-4"/> Buses</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition"
          >
            {apiKey ? '🔑 Key Set' : '⚙️ API Key'}
          </button>

          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold text-sm transition flex items-center gap-2 shadow-sm"
          >
            {user ? <UserCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            {user ? user.name : 'Log in / Sign up'}
          </button>
        </div>
      </header>

      {/* API Key Modal Bar */}
      {showKeyInput && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 text-center">
          <div className="max-w-md mx-auto flex gap-2 items-center">
            <input 
              type="password" 
              placeholder="Paste Gemini API Key" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button 
              onClick={() => setShowKeyInput(false)}
              className="bg-amber-600 text-white px-4 py-2 text-sm rounded-lg font-semibold"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Hero Planner Box */}
      <main className="max-w-6xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                Create Trip with AI <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              </h1>
              <p className="text-slate-500 text-sm mt-1">Smart India Hackathon & Portfolio Project</p>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-orange-500 transition">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Starting City
              </label>
              <input 
                type="text" 
                value={source} 
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 outline-none mt-1"
              />
            </div>

            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-orange-500 transition">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Destination
              </label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 outline-none mt-1"
                placeholder="e.g. Goa, Agra, Jaipur"
              />
            </div>

            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-orange-500 transition">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Days & Travelers
              </label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="number" 
                  value={days} 
                  onChange={(e) => setDays(e.target.value)}
                  className="w-1/2 text-base font-semibold text-slate-800 outline-none"
                  placeholder="Days"
                />
                <span className="text-slate-300">|</span>
                <input 
                  type="number" 
                  value={travelers} 
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-1/2 text-base font-semibold text-slate-800 outline-none"
                  placeholder="People"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-orange-500 transition">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" /> Budget (₹)
              </label>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-base font-semibold text-slate-800 outline-none mt-1"
              />
            </div>
          </div>

          {/* Vibe Selection */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Vibe</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                      isSelected 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            onClick={generateTrip} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-lg py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'AI Agent Planning Your Journey...' : '✨ Generate AI Travel Plan'}
          </button>
        </div>

        {/* Popular Locations Cards Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Explore Top Indian Destinations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularDestinations.map((place) => (
              <div key={place.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 hover:shadow-xl transition group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={place.image} 
                    alt={place.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                    {place.category}
                  </span>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{place.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{place.description}</p>
                  
                  <div className="flex gap-2">
                    <a 
                      href={place.mapUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-orange-500" /> Google Maps
                    </a>
                    <a 
                      href={place.wikiUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" /> Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Generated Itinerary Showcase */}
        {itinerary && (
          <div className="mt-10 bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900">🎉 Personalized Itinerary</h2>
              <button 
                onClick={exportPDF} 
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>

            <div id="itinerary-content" className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
              {itinerary}
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Chat Assistant Drawer */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center gap-2 font-bold"
          >
            <MessageSquareBot className="w-6 h-6" />
            <span className="hidden md:inline">AI Travel Guide</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden">
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <MessageSquareBot className="w-5 h-5" /> AI Travel Assistant
              </div>
              <button onClick={() => setChatOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-xl max-w-[85%] ${
                    msg.sender === 'user' 
                      ? 'bg-orange-500 text-white ml-auto' 
                      : 'bg-white text-slate-800 border border-slate-200 mr-auto shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t flex gap-2">
              <input 
                type="text" 
                placeholder="Ask travel questions..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-orange-500 text-white px-3 py-2 rounded-xl text-xs font-bold"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Welcome to Ixigo AI</h3>
            <p className="text-slate-500 text-xs mb-6">Sign in to save and access your travel itineraries</p>

            <button 
              onClick={() => {
                setUser({ name: "Demo Travel User", email: "user@sih.gov.in" });
                setShowLoginModal(false);
              }}
              className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition mb-3"
            >
              <LogIn className="w-4 h-4 text-blue-600" /> Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}