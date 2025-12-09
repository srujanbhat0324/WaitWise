import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Ticket, Clock, CheckCircle, XCircle } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

const TokenHistory = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            // Get from user's tokenHistory field
            const res = await axios.get('/auth/user');
            setHistory(res.data.tokenHistory || []);
        } catch (err) {
            console.error('Failed to fetch token history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSkeleton type="list" />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Token History</h1>
                <p className="text-slate-500">View all your past queue tokens</p>
            </div>

            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map((token, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-primary transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Ticket className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Token #{token.tokenNumber}</p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(token.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {token.status === 'Completed' ? (
                                        <CheckCircle className="text-green-600" size={20} />
                                    ) : token.status === 'Cancelled' ? (
                                        <XCircle className="text-red-600" size={20} />
                                    ) : (
                                        <Clock className="text-orange-600" size={20} />
                                    )}
                                    <span className={`text-sm font-medium ${token.status === 'Completed' ? 'text-green-600' :
                                            token.status === 'Cancelled' ? 'text-red-600' :
                                                'text-orange-600'
                                        }`}>
                                        {token.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center">
                    <Ticket size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Token History</h3>
                    <p className="text-slate-500">You haven't joined any queues yet</p>
                </div>
            )}
        </div>
    );
};

export default TokenHistory;
