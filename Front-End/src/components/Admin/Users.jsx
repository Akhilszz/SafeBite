import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const serverUrl = 'https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app'

    async function fetchUser() {
        try {
            const res = await axios.get(`${serverUrl}/api/getuser`);
            if (res.data.success) {
                setUsers(res.data.users);
            } else {
                setError(res.data.msg);
            }
        } catch (err) {
            setError('Failed to fetch users');
            console.error('User fetch error:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleActionClick = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'block' ? 'unblock' : 'block';
            const res = await axios.put(`${serverUrl}/api/updateUserStatus/${userId}`,
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data.success) {
                fetchUser()
            } else {
                alert(res.data.msg)
            }


        } catch (err) {
            console.error('Error updating user status:', err);
            setError('Failed to update user status');
        }
    };

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="overflow-x-auto bg-white shadow rounded-lg p-4 mt-14 ml-44 max-md:ml-0">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-gray-500">Loading...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-red-500">{error}</span>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <img src={`https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app/${user.image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleActionClick(user._id, user.status)}
                                            className={`px-4 py-2 rounded ${user.status === 'block' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} hover:opacity-80`}
                                        >
                                            {user.status === 'block' ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};
