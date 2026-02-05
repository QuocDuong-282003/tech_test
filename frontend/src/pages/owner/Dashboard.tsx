import { useEffect, useState } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, type Employee } from '../../services/owner';
import { Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';

const OwnerDashboard = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmpId, setCurrentEmpId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        department: string;
        role: string;
        status: 'Active' | 'Inactive' | 'Pending';
    }>({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: 'Employee',
        status: 'Active'
    });

    // Drag logic
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!showModal) {
            setPosition({ x: 0, y: 0 }); // Reset position on close or open
        }
    }, [showModal]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('mousemove', handleMouseMove as any);
        } else {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove as any);
        }
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove as any);
        };
    }, [isDragging]);


    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await getEmployees();
            setEmployees(res.data.employees);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', department: '', role: 'Employee', status: 'Active' });
        setIsEditing(false);
        setCurrentEmpId(null);
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentEmpId) {
                await updateEmployee({ ...formData, employeeId: currentEmpId });
            } else {
                await createEmployee(formData);
            }
            setShowModal(false);
            resetForm();
            fetchEmployees();
        } catch (error) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} employee`);
        }
    };

    const handleEdit = (emp: Employee) => {
        setFormData({
            name: emp.name,
            email: emp.email,
            phone: emp.phone || '',
            department: emp.department || '',
            role: emp.role || 'Employee',
            status: emp.status || 'Active'
        });
        setCurrentEmpId(emp.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteEmployee(id);
            fetchEmployees();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-600';
            case 'Inactive': return 'bg-red-100 text-red-600';
            case 'Pending': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Employee</h1>
                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Employee</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Employee Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Department</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                                <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                                <td className="px-6 py-4 text-gray-600">{emp.department || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(emp.status || 'Active')}`}>
                                        {emp.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleEdit(emp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {employees.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No employees found.</div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto" onClick={() => setShowModal(false)}></div>

                    {/* Draggable Modal */}
                    <div
                        className="bg-white rounded-2xl w-[600px] p-8 shadow-xl pointer-events-auto"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            position: 'relative'
                        }}
                    >
                        {/* Drag Handle */}
                        <div
                            onMouseDown={handleMouseDown}
                            className="absolute top-0 left-0 right-0 h-16 cursor-move z-10 rounded-t-2xl"
                            title="Drag to move"
                        ></div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800 select-none relative z-0">
                            {isEditing ? 'Edit Employee' : 'Create Employee'}
                        </h2>

                        <form onSubmit={handleCreateOrUpdate} className="space-y-6 relative z-20">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0912..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="email@company.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <input
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Engineer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <input
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Engineering"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending' })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
