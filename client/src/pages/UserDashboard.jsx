import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bookmark, Clock, Ticket, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookmarkedOffices, setBookmarkedOffices] = useState([]);
    const [tokenHistory, setTokenHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const userRes = await axios.get('/auth/user');
            if (userRes.data.bookmarks) {
                setBookmarkedOffices(userRes.data.bookmarks);
            }
            if (userRes.data.tokenHistory) {
                setTokenHistory(userRes.data.tokenHistory.slice(-5).reverse());
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome, {user?.name}!</h1>
                <p className="text-slate-500">Manage your queues and bookmarks</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Bookmark className="text-primary" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{bookmarkedOffices.length}</span>
                    </div>
                    <p className="text-slate-500 text-sm">Bookmarked Offices</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Ticket className="text-green-600" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{tokenHistory.length}</span>
                    </div>
                    <p className="text-slate-500 text-sm">Total Tokens</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <TrendingUp className="text-purple-600" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">0</span>
                    </div>
                    <p className="text-slate-500 text-sm">Active Tokens</p>
                </div>
            </div>

            {/* Bookmarked Offices */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Bookmarked Offices</h2>
                {bookmarkedOffices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookmarkedOffices.map((office) => (
                            <Link
                                key={office._id}
                                to={`/office/${office._id}`}
                                className="p-4 border border-slate-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
                            >
                                <h3 className="font-bold text-slate-800">{office.name}</h3>
                                <p className="text-sm text-slate-500">{office.address}</p>
                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                    {office.type}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <Bookmark size={48} className="mx-auto mb-2 text-slate-300" />
                        <p>No bookmarked offices yet</p>
                        <Link to="/" className="text-primary hover:underline text-sm mt-2 inline-block">
                            Browse offices
                        </Link>
                    </div>
                )}
            </div>

            {/* Token History */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Token History</h2>
                {tokenHistory.length > 0 ? (
                    <div className="space-y-3">
                        {tokenHistory.map((token, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Ticket className="text-primary" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">Token #{token.tokenNumber}</p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(token.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Clock size={18} className="text-slate-400" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <Ticket size={48} className="mx-auto mb-2 text-slate-300" />
                        <p>No token history yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
