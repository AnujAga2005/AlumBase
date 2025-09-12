import React from 'react';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, User, Users, Calendar, DollarSign, MoreVertical, Trash2, UserX } from 'lucide-react';

// It's assumed GSAP is loaded globally in your project.
const gsap = window.gsap;

// --- Mock Data ---
const mockDashboardData = {
    stats: [
        { label: 'Total Alumni Registered', value: '1,256', icon: Users, color: 'text-purple-400' },
        { label: 'Active Students', value: '3,480', icon: User, color: 'text-blue-400' },
        { label: 'Upcoming Events', value: '8', icon: Calendar, color: 'text-teal-400' },
        { label: 'Total Donations Received', value: '$84,950', icon: DollarSign, color: 'text-green-400' },
    ],
    alumniGrowth: [
        { month: 'Jan', registrations: 20 }, { month: 'Feb', registrations: 35 },
        { month: 'Mar', registrations: 45 }, { month: 'Apr', registrations: 60 },
        { month: 'May', registrations: 55 }, { month: 'Jun', registrations: 75 },
    ],
    donationDistribution: [
        { name: 'Scholarship', value: 45000 }, { name: 'Infrastructure', value: 25000 },
        { name: 'Community', value: 10000 }, { name: 'Research', value: 4950 },
    ],
};

const mockUsers = {
    students: [
        { id: 's1', name: 'Alice Johnson', email: 'alice.j@university.edu', course: 'Computer Science', year: 3, status: 'Active', avatar: 'https://placehold.co/100x100/7c3aed/FFFFFF?text=AJ' },
        { id: 's2', name: 'Bob Williams', email: 'bob.w@university.edu', course: 'Mechanical Engineering', year: 4, status: 'Active', avatar: 'https://placehold.co/100x100/2563eb/FFFFFF?text=BW' },
        { id: 's3', name: 'Charlie Brown', email: 'charlie.b@university.edu', course: 'Business Administration', year: 2, status: 'Suspended', avatar: 'https://placehold.co/100x100/9ca3af/FFFFFF?text=CB' },
    ],
    alumni: [
        { id: 'a1', name: 'Diana Prince', email: 'diana.p@example.com', company: 'Wayne Enterprises', batch: 2015, status: 'Active', avatar: 'https://placehold.co/100x100/db2777/FFFFFF?text=DP' },
        { id: 'a2', name: 'Bruce Wayne', email: 'bruce.w@example.com', company: 'Wayne Enterprises', batch: 2010, status: 'Active', avatar: 'https://placehold.co/100x100/171717/FFFFFF?text=BW' },
        { id: 'a3', name: 'Clark Kent', email: 'clark.k@example.com', company: 'Daily Planet', batch: 2012, status: 'Active', avatar: 'https://placehold.co/100x100/dc2626/FFFFFF?text=CK' },
    ]
};


// --- Main Admin Panel Component ---
const AdminPanel = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const mainContentRef = useRef(null);

    const handleViewChange = (view) => {
        if (view !== activeView) {
            if (gsap) {
                gsap.to(mainContentRef.current, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        setActiveView(view);
                        gsap.fromTo(mainContentRef.current,
                            { opacity: 0, y: -20 },
                            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                        );
                    }
                });
            } else {
                setActiveView(view);
            }
        }
    };
    
    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'users': return <UserManagementView />;
            case 'events': return <PlaceholderView title="Event Management" />;
            case 'donations': return <PlaceholderView title="Donation Management" />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-200 font-sans flex min-h-screen">
            <Sidebar activeView={activeView} onViewChange={handleViewChange} />
            <main ref={mainContentRef} className="flex-1 p-4 sm:p-6 md:p-10 ml-0 md:ml-64">
                {renderView()}
            </main>
        </div>
    );
};

// --- Sidebar Component ---
const Sidebar = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: User },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'events', label: 'Event Management', icon: Calendar },
        { id: 'donations', label: 'Donation Management', icon: DollarSign },
    ];
    
    return (
        <aside className="fixed left-0 top-0 w-64 h-full bg-black text-white p-6 flex-col z-20 shadow-2xl shadow-purple-900/20 hidden md:flex">
            <h1 className="text-2xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Admin Panel</h1>
            <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${activeView === item.id ? 'bg-purple-600/30 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto">
                <p className="text-xs text-center text-gray-600">&copy; {new Date().getFullYear()} Alumni Portal</p>
            </div>
        </aside>
    );
};


// --- Dashboard View ---
const DashboardView = () => {
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

    useLayoutEffect(() => {
        if (!gsap) return;
        gsap.from(".stat-card", {
            opacity: 0, scale: 0.9, y: 20, stagger: 0.15, duration: 0.6, ease: 'back.out(1.4)', delay: 0.2
        });
         gsap.from(".chart-container", {
            opacity: 0, y: 50, duration: 0.8, ease: 'power3.out', delay: 0.5
        });
    }, []);

    return (
        <div>
            <h2 className="text-4xl font-bold mb-2">Welcome Back, Admin!</h2>
            <p className="text-gray-400 mb-8">Here's a snapshot of your portal's activity.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {mockDashboardData.stats.map(stat => (
                    <div key={stat.label} className="stat-card bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center space-x-4">
                        <stat.icon className={`h-10 w-10 ${stat.color}`} />
                        <div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="chart-container lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Alumni Registrations Growth</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockDashboardData.alumniGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="month" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                            <Legend />
                            <Bar dataKey="registrations" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-container lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Donation Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                            <Pie data={mockDashboardData.donationDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {mockDashboardData.donationDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- User Management View ---
const UserManagementView = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [users, setUsers] = useState(mockUsers[activeTab]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionUser, setActionUser] = useState(null);
    const [modalAction, setModalAction] = useState('');

    useEffect(() => {
        setUsers(mockUsers[activeTab]);
    }, [activeTab]);

    const handleActionClick = (user, action) => {
        setActionUser(user);
        setModalAction(action);
        setIsModalOpen(true);
    };

    const confirmAction = () => {
        console.log(`${modalAction} user:`, actionUser.name);
        // Add actual logic here, e.g., API call
        setIsModalOpen(false);
    };
    
    return (
        <div>
            <h2 className="text-4xl font-bold mb-8">User Management</h2>
            
            <div className="flex border-b border-gray-700 mb-6">
                <button onClick={() => setActiveTab('students')} className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'students' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500'}`}>Students</button>
                <button onClick={() => setActiveTab('alumni')} className={`py-2 px-6 font-semibold transition-colors ${activeTab === 'alumni' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500'}`}>Alumni</button>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <input type="text" placeholder="Search by name, email..." className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 pl-10"/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5"/>
                    </div>
                </div>
                <UserTable users={users} onAction={handleActionClick} type={activeTab} />
            </div>

            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmAction}
                action={modalAction}
                userName={actionUser?.name}
            />
        </div>
    );
};

// --- User Table Sub-component ---
const UserTable = ({ users, onAction, type }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b border-gray-700">
                        <th className="p-3">User</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">{type === 'students' ? 'Current Year' : 'Batch'}</th>
                        <th className="p-3">{type === 'students' ? 'Course' : 'Company'}</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800">
                            <td className="p-3 flex items-center space-x-3">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full"/>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </td>
                            <td className="p-3 capitalize">{type.slice(0, -1)}</td>
                            <td className="p-3">{user.year || user.batch}</td>
                            <td className="p-3">{user.course || user.company}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-3 text-right">
                                <div className="relative inline-block">
                                    <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}>
                                        <MoreVertical className="h-5 w-5 text-gray-400"/>
                                    </button>
                                    {openMenuId === user.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
                                            <button onClick={() => { onAction(user, 'suspend'); setOpenMenuId(null); }} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800"><UserX size={16}/><span>Suspend</span></button>
                                            <button onClick={() => { onAction(user, 'delete'); setOpenMenuId(null); }} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800"><Trash2 size={16}/><span>Delete</span></button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, userName }) => {
    if (!isOpen) return null;
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div onClick={e => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 max-w-sm w-full border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
                <p className="text-gray-400 mb-6">Are you sure you want to {action} the account for <span className="font-semibold text-white">{userName}</span>? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
                    <button onClick={onConfirm} className={`px-4 py-2 rounded-md ${action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                        Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Placeholder View for other sections ---
const PlaceholderView = ({ title }) => (
    <div>
        <h2 className="text-4xl font-bold mb-8">{title}</h2>
        <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-20 text-center">
            <p className="text-gray-500">Content for this section will be available soon.</p>
        </div>
    </div>
);


export default AdminPanel;

