import { useEffect, useState } from 'react';
import { getAllTasks, createTask, type Task } from '../../services/task';
import { getEmployees, type Employee } from '../../services/owner';
// import { Plus, User, Clock } from 'lucide-react';

const OwnerTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        assignedTo: ''
    });

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await getAllTasks();
            setTasks(res.data.tasks);
        } catch (error) {
            console.error('Fetch tasks error', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await getEmployees();
            setEmployees(res.data.employees);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTask(formData);
            setShowModal(false);
            setFormData({ title: '', description: '', deadline: '', assignedTo: '' });
            fetchTasks();
        } catch (error) {
            alert('Failed to create task');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-600';
            case 'In Progress': return 'bg-blue-100 text-blue-600';
            default: return 'bg-yellow-100 text-yellow-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Manage Tasks</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                    + Create Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                            </span>
                            <span className="text-gray-400 text-sm">
                                {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h3>
                        <p className="text-gray-500 text-sm mb-4">{task.description}</p>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex items-center text-sm text-gray-600">
                                Assigned to: {employees.find(e => e.id === task.assignedTo)?.name || 'Unknown'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100">
                    No tasks found. Click "Create Task" to add one.
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-[500px] p-8 relative shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Task Title"
                                />
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Description"
                                />
                                <input
                                    required
                                    type="date"
                                    value={formData.deadline}
                                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <select
                                    required
                                    value={formData.assignedTo}
                                    onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerTasks;
