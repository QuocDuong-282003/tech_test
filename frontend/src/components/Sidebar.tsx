import { LayoutDashboard, Users, MessageSquare, ClipboardList, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('owner_auth');
        navigate('/owner/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Manage Overview', path: '/owner/dashboard' },
        { icon: Users, label: 'Manage Employee', path: '/owner/employees' },
        { icon: ClipboardList, label: 'Manage Task', path: '/owner/tasks' },
        { icon: MessageSquare, label: 'Message', path: '/owner/messages' },
    ];

    return (
        <div className={`bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-20 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className={`p-6 flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                {isOpen && <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">Skipli</span>}
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-8 bg-white border border-gray-200 p-1 rounded-full shadow-sm hover:bg-gray-50 text-gray-500 transition-colors z-30"
            >
                {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center ${isOpen ? 'space-x-3 px-4' : 'justify-center px-0'} py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                        title={!isOpen ? item.label : ''}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${isOpen ? 'space-x-3 px-4' : 'justify-center px-0'} py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors`}
                    title={!isOpen ? 'Log Out' : ''}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="whitespace-nowrap">Log Out</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
