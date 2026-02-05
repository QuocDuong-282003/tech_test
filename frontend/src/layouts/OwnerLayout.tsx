import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const OwnerLayout = () => {
    const ownerPhone = localStorage.getItem('owner_phone') || 'Owner';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Fixed Header */}
                <div className={`h-16 bg-white shadow-sm fixed top-0 right-0 z-10 px-8 flex justify-between items-center transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-20'}`}>
                    <h2 className="text-xl font-bold text-gray-800">Skipli</h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-800">{ownerPhone}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                            {ownerPhone.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Main Content with top padding for header */}
                <div className="p-8 pt-24 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default OwnerLayout;
