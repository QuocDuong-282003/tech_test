import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, LogOut, ClipboardList, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { io } from 'socket.io-client';

const EmployeeLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Employee data
    const empDataString = localStorage.getItem('employee_data');
    const empData = empDataString ? JSON.parse(empDataString) : { name: 'Employee', role: 'Staff', id: '' };
    const empName = empData.name || 'Employee';
    const empRole = empData.role || 'Staff';
    const empId = localStorage.getItem('employee_id');

    useEffect(() => {
        if (!empId) return;

        // Socket init
        const newSocket = io(import.meta.env.VITE_API_URL);

        newSocket.on('connect', () => {
            console.log('Connected to socket', newSocket.id);
            newSocket.emit('join', empId);
        });

        // Force logout listener
        newSocket.on('forceLogout', (data: { reason: string }) => {
            const reason = data.reason === 'Inactive'
                ? 'Tài khoản bạn đang bị vô hiệu hóa. Vui lòng liên hệ admin để được hỗ trợ'
                : 'Tài khoản bạn đang ở trạng thái chờ duyệt. Vui lòng liên hệ admin để được hỗ trợ'; // Pending

            alert(reason);
            localStorage.clear();
            navigate('/employee/login');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [empId, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('employee_token');
        localStorage.removeItem('employee_id');
        localStorage.removeItem('employee_data');
        navigate('/employee/login');
    };

    const menuItems = [
        { path: '/employee/dashboard', label: 'Manage Task', icon: ClipboardList },
        { path: '/employee/messages', label: 'Message', icon: MessageSquare },
        { path: '/employee/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className={`bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 h-screen z-20 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className={`p-6 flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    {isSidebarOpen && <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">Employee</span>}
                </div>

                {/* Floating Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-8 bg-white border border-gray-200 p-1 rounded-full shadow-sm hover:bg-gray-50 text-gray-500 transition-colors z-30"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center ${isSidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-green-50 text-green-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isSidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'} py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors`}
                        title={!isSidebarOpen ? 'Sign Out' : ''}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="font-medium whitespace-nowrap">Sign Out</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Fixed Header */}
                <div className={`h-16 bg-white shadow-sm fixed top-0 right-0 z-10 px-8 flex justify-between items-center transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-20'}`}>
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-800">Workspace</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-800">{empName}</p>
                            <p className="text-xs text-gray-500">{empRole}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border border-green-200">
                            {empName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-24 pl-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default EmployeeLayout;
