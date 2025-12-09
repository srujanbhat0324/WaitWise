import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Search, Bookmark, Clock, Users, Zap, Bell } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [offices, setOffices] = useState([]);
    const [filteredOffices, setFilteredOffices] = useState([]);
    const [bookmarkedOffices, setBookmarkedOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');

    useEffect(() => {
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    fetchOffices(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    // Fallback to fetch all offices or default location
                    fetchOffices();
                }
            );
        } else {
            fetchOffices();
        }
    }, []);

    useEffect(() => {
        // Filter offices based on search and type
        let filtered = offices;

        if (searchQuery) {
            filtered = filtered.filter(office =>
                office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                office.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedType !== 'All') {
            filtered = filtered.filter(office => office.type === selectedType);
        }

        setFilteredOffices(filtered);

        // Update bookmarked offices
        if (user?.bookmarks) {
            const bookmarked = offices.filter(office =>
                user.bookmarks.some(b => (b._id || b) === office._id)
            );
            setBookmarkedOffices(bookmarked);
        }
    }, [searchQuery, selectedType, offices, user]);

    const fetchOffices = async (lat, lng) => {
        try {
            let url = '/office';
            if (lat && lng) {
                url += `?lat=${lat}&lng=${lng}&radius=50`;
            }
            const res = await axios.get(url);
            setOffices(res.data);
            setFilteredOffices(res.data);
        } catch (err) {
            setError('Failed to fetch offices');
        } finally {
            setLoading(false);
        }
    };

    const OfficeCard = ({ office, showBookmarkBadge = false }) => (
        <Link
            key={office._id}
            to={`/office/${office._id}`}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow block group relative"
        >
            {showBookmarkBadge && (
                <div className="absolute top-3 right-3">
                    <Bookmark size={16} className="text-primary" fill="currentColor" />
                </div>
            )}
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={24} />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {office.type}
                </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{office.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{office.address}</p>

            <div className="flex items-center text-primary text-sm font-medium">
                <Navigation size={16} className="mr-1" />
                <span>View Departments</span>
            </div>
        </Link>
    );

    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-lg">
                <div className="max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">WaitWise - Smart Queue Management</h1>
                    <p className="text-blue-100 text-lg mb-6">
                        Skip the wait, track your queue in real-time. Get AI-powered wait time predictions and never miss your turn.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="text-blue-200" size={20} />
                            <span className="text-sm">Real-time Updates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-200" size={20} />
                            <span className="text-sm">AI Predictions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bell className="text-blue-200" size={20} />
                            <span className="text-sm">Notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="text-blue-200" size={20} />
                            <span className="text-sm">Multi-Department</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Find Nearby Offices</h2>
                <p className="text-slate-500 mb-4">Discover hospitals, banks, and offices near you.</p>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for an office..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Hospital', 'RTO', 'Bank', 'Other'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedType === type
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookmarked Offices */}
            {user && bookmarkedOffices.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Bookmark size={20} className="text-primary" />
                        <h2 className="text-lg font-bold text-slate-800">Your Bookmarks</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarkedOffices.map((office) => (
                            <OfficeCard key={office._id} office={office} showBookmarkBadge={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Offices */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                    {bookmarkedOffices.length > 0 ? 'All Offices' : 'Offices'}
                </h2>
                {loading ? (
                    <div className="text-center py-10">Loading nearby offices...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOffices.map((office) => (
                            <OfficeCard key={office._id} office={office} />
                        ))}

                        {filteredOffices.length === 0 && (
                            <div className="col-span-full text-center py-10 text-slate-500">
                                No offices found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
