import { useEffect, useState } from 'react';
import { getTasksByEmployee, updateTaskStatus, type Task } from '../../services/task';

const EmployeeDashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const empId = localStorage.getItem('employee_id');
    const empData = JSON.parse(localStorage.getItem('employee_data') || '{}');

    useEffect(() => {
        if (!empId) return;
        fetchTasks();
    }, [empId]);

    const fetchTasks = async () => {
        try {
            const res = await getTasksByEmployee(empId!);
            setTasks(res.data.tasks);
        } catch (error) {
            console.error('Fetch tasks failed:', error);
        }
    };

    const handleMarkDone = async (taskId: string) => {
        try {
            await updateTaskStatus(taskId, 'done');
            fetchTasks();
        } catch (error) {
            console.error('Update task failed:', error);
            alert('Error updating task');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome, {empData.name}
                </h1>
                <p className="text-gray-600 mb-8">
                    {empData.role} - {empData.department}
                </p>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">My Tasks</h2>

                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`p-4 border rounded flex justify-between items-center ${task.status === 'done'
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-white'
                                    }`}
                            >
                                <div>
                                    <h3
                                        className={`font-semibold ${task.status === 'done'
                                            ? 'line-through text-gray-500'
                                            : 'text-gray-800'
                                            }`}
                                    >
                                        {task.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {task.description}
                                    </p>
                                    {task.deadline && (
                                        <span className="text-xs text-red-500">
                                            Due: {task.deadline}
                                        </span>
                                    )}
                                </div>

                                {task.status !== 'done' ? (
                                    <button
                                        onClick={() => handleMarkDone(task.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                    >
                                        Mark Done
                                    </button>
                                ) : (
                                    <span className="text-green-600 font-semibold text-sm">
                                        Completed
                                    </span>
                                )}
                            </div>
                        ))}

                        {tasks.length === 0 && (
                            <p className="text-gray-500">No tasks assigned.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
