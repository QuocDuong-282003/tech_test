import { Edit2, Trash2 } from 'lucide-react';
import type { Employee } from '../../../services/owner';

interface Props {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-600';
    case 'Inactive': return 'bg-red-100 text-red-600';
    case 'Pending': return 'bg-yellow-100 text-yellow-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const EmployeeTable = ({ employees, onEdit, onDelete }: Props) => {
  if (employees.length === 0) {
    return <div className="p-8 text-center text-gray-500">No employees found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-semibold text-gray-600">Employee Name</th>
            <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
            <th className="px-6 py-4 font-semibold text-gray-600">Department</th>
            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-600">Schedule</th>
            <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((emp) => (
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
                {emp.workSchedule ? (
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {emp.workSchedule.startTime} - {emp.workSchedule.endTime}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {emp.workSchedule.days.join(', ')}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 italic text-sm">Not set</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-3">
                  <button onClick={() => onEdit(emp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => onDelete(emp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
