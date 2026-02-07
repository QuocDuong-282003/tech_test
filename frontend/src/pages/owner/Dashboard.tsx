import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, type Employee } from '../../services/owner';
import { Plus, Search, Filter } from 'lucide-react';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeFormModal } from './components/EmployeeFormModal';

const OwnerDashboard = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEmp, setCurrentEmp] = useState<Employee | null>(null);

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

    const handleCreateOrUpdate = async (data: any) => {
        try {
            if (currentEmp) {
                await updateEmployee({ ...data, employeeId: currentEmp.id });
                toast.success('Employee updated successfully');
            } else {
                await createEmployee(data);
                toast.success('Employee created successfully');
            }
            fetchEmployees();
        } catch (error) {
            toast.error(currentEmp ? 'Failed to update employee' : 'Failed to create employee');
            throw error;
        }
    };

    const handleEdit = (emp: Employee) => {
        setCurrentEmp(emp);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;
        try {
            await deleteEmployee(id);
            toast.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            toast.error('Failed to delete employee');
        }
    };

    const handleOpenCreate = () => {
        setCurrentEmp(null);
        setShowModal(true);
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
                        onClick={handleOpenCreate}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Employee</span>
                    </button>
                </div>
            </div>

            <EmployeeTable
                employees={employees}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateOrUpdate}
                initialData={currentEmp}
            />
        </div>
    );
};

export default OwnerDashboard;
