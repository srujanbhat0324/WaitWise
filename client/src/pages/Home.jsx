import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Navigation, Search } from 'lucide-react';

const Home = () => {
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');

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

    const fetchOffices = async (lat, lng) => {
        try {
            let url = '/office';
            if (lat && lng) {
                url += `?lat=${lat}&lng=${lng}&radius=50`;
            }
            const res = await axios.get(url);
            setOffices(res.data);
        } catch (err) {
            setError('Failed to fetch offices');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Find Nearby Offices</h1>
                <p className="text-slate-500 mb-4">Discover hospitals, banks, and offices near you.</p>

                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for an office..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading nearby offices...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offices.map((office) => (
                        <Link
                            key={office._id}
                            to={`/office/${office._id}`}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow block group"
                        >
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
                    ))}

                    {offices.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            No offices found nearby.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
