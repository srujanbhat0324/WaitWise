import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, ChevronRight, Bookmark } from 'lucide-react';

const OfficeView = () => {
    const { id } = useParams();
    const { user, setUser } = useAuth();
    const [office, setOffice] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [officeRes, deptRes] = await Promise.all([
                    axios.get(`/office`),
                    axios.get(`/office/${id}/departments`)
                ]);

                const currentOffice = officeRes.data.find(o => o._id === id);
                setOffice(currentOffice);
                setDepartments(deptRes.data);

                // Check if bookmarked
                if (user?.bookmarks) {
                    setIsBookmarked(user.bookmarks.some(b => b._id === id || b === id));
                }
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleBookmark = async () => {
        if (!user) {
            alert('Please login to bookmark offices');
            return;
        }

        try {
            const res = await axios.post(`/auth/bookmark/${id}`);
            setUser(res.data);
            setIsBookmarked(!isBookmarked);
        } catch (err) {
            console.error('Failed to toggle bookmark', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">{office?.name || 'Office'}</h1>
                        <p className="text-slate-500 text-sm">{office?.address}</p>
                    </div>
                    <div className="flex gap-2">
                        {user && (
                            <button
                                onClick={handleBookmark}
                                className={`p-2 rounded-lg transition-colors ${isBookmarked
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                            >
                                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                        )}
                        <Link to="/" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Departments</h2>
                {loading ? (
                    <div className="text-center py-10">Loading departments...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {departments.map((dept) => (
                            <Link
                                key={dept._id}
                                to={`/department/${dept._id}`}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center justify-between group"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{dept.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Users size={16} />
                                            <span>Wait: {dept.avgWaitTimePerToken * (dept.totalTokens - dept.currentToken)} min</span>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${dept.crowdLevel === 'High' ? 'bg-red-100 text-red-600' :
                                            dept.crowdLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            {dept.crowdLevel} Crowd
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                            </Link>
                        ))}

                        {departments.length === 0 && (
                            <div className="col-span-full text-center py-10 text-slate-500">
                                No departments found for this office.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficeView;
