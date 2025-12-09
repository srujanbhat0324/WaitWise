import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Ticket, Clock, MapPin, TrendingUp } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ActiveTokens = () => {
    const { user } = useAuth();
    const [activeTokens, setActiveTokens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActiveTokens();
        // Refresh every 30 seconds
        const interval = setInterval(loadActiveTokens, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadActiveTokens = () => {
        const tokens = [];
        // Check localStorage for all active tokens
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('waitwise_token_')) {
                try {
                    const tokenData = JSON.parse(localStorage.getItem(key));
                    if (tokenData && tokenData.token) {
                        tokens.push({
                            ...tokenData,
                            storageKey: key
                        });
                    }
                } catch (err) {
                    console.error('Failed to parse token:', err);
                }
            }
        }
        setActiveTokens(tokens);
        setLoading(false);
    };

    const removeToken = (storageKey) => {
        localStorage.removeItem(storageKey);
        loadActiveTokens();
    };

    if (loading) {
        return <LoadingSkeleton type="list" />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Active Tokens</h1>
                <p className="text-slate-500">Track your current queue positions</p>
            </div>

            {activeTokens.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTokens.map((token, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Ticket className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-800">#{token.token}</p>
                                        <p className="text-sm text-slate-500">Your Token</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeToken(token.storageKey)}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Clock size={16} />
                                    <span>Saved: {new Date(token.savedAt).toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                to={`/department/${token.departmentId}`}
                                className="mt-4 block w-full text-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Queue
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center">
                    <Ticket size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Active Tokens</h3>
                    <p className="text-slate-500 mb-4">You don't have any active queue tokens</p>
                    <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Browse Offices
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ActiveTokens;
