import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Clock, ChevronRight } from 'lucide-react';

const OfficeView = () => {
    const { id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get(`/office/${id}/departments`);
                setDepartments(res.data);
            } catch (err) {
                setError('Failed to fetch departments');
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, [id]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
                <Link to="/" className="text-primary hover:underline text-sm">Back to Home</Link>
            </div>

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
    );
};

export default OfficeView;
