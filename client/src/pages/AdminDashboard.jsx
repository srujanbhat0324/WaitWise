import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, Building } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('office');
    const [message, setMessage] = useState('');

    // Office Form State
    const [officeForm, setOfficeForm] = useState({
        name: '', address: '', lat: '', lng: '', type: 'Hospital'
    });

    // Department Form State
    const [deptForm, setDeptForm] = useState({
        name: '', officeId: '', avgWaitTimePerToken: 10
    });

    if (user?.role !== 'super_admin') {
        return <div className="text-center py-10 text-red-500">Access Denied</div>;
    }

    const handleOfficeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/office', officeForm);
            setMessage('Office created successfully!');
            setOfficeForm({ name: '', address: '', lat: '', lng: '', type: 'Hospital' });
        } catch (err) {
            setMessage('Failed to create office');
        }
    };

    const handleDeptSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/office/${deptForm.officeId}/departments`, {
                name: deptForm.name,
                avgWaitTimePerToken: deptForm.avgWaitTimePerToken
            });
            setMessage('Department created successfully!');
            setDeptForm({ name: '', officeId: '', avgWaitTimePerToken: 10 });
        } catch (err) {
            setMessage('Failed to create department');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Super Admin Dashboard</h1>

            {message && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                    {message}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('office')}
                        className={`flex-1 py-4 text-sm font-medium ${activeTab === 'office' ? 'bg-blue-50 text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Add Office
                    </button>
                    <button
                        onClick={() => setActiveTab('department')}
                        className={`flex-1 py-4 text-sm font-medium ${activeTab === 'department' ? 'bg-blue-50 text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Add Department
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'office' ? (
                        <form onSubmit={handleOfficeSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Office Name</label>
                                    <input
                                        type="text"
                                        value={officeForm.name}
                                        onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        value={officeForm.type}
                                        onChange={(e) => setOfficeForm({ ...officeForm, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                    >
                                        <option>Hospital</option>
                                        <option>RTO</option>
                                        <option>Bank</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={officeForm.address}
                                    onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={officeForm.lat}
                                        onChange={(e) => setOfficeForm({ ...officeForm, lat: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={officeForm.lng}
                                        onChange={(e) => setOfficeForm({ ...officeForm, lng: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
                                Create Office
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleDeptSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Office ID</label>
                                <input
                                    type="text"
                                    value={deptForm.officeId}
                                    onChange={(e) => setDeptForm({ ...deptForm, officeId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                    placeholder="Paste Office ID here"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                                <input
                                    type="text"
                                    value={deptForm.name}
                                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Avg Wait Time (mins)</label>
                                <input
                                    type="number"
                                    value={deptForm.avgWaitTimePerToken}
                                    onChange={(e) => setDeptForm({ ...deptForm, avgWaitTimePerToken: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
                                Create Department
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
