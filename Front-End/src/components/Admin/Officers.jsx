import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";
import axios from 'axios';

export const Officer = () => {
    const [officers, setOfficers] = useState([]);
    const [type, setType] = useState(true); // true for "View", false for "Add"
    const [edit, setEdit] = useState(false);
    const [newOfficer, setNewOfficer] = useState({
        name: '',
        email: '',
        district: '',
        password: '',
        image: null, // Image field
    });
    const [selectedOfficerId, setSelectedOfficerId] = useState(null);

    const serverUrl = 'https://safe-bite.vercel.app'

    useEffect(() => {
        fetchOfficers();
    }, []);

    async function fetchOfficers() {
        try {
            const res = await axios.get(`${serverUrl}/api/getofficer`);
            if (res.data.success) {
                setOfficers(res.data.officers);
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    async function handleAddOfficer(event) {
        event.preventDefault();
        const formData = new FormData();
        for (const key in newOfficer) {
            formData.append(key, newOfficer[key]);
        }

        try {
            const res = await axios.post(`${serverUrl}/api/addofficer`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data.success) {
                alert(res.data.msg);
                fetchOfficers();
                resetForm();
            } else {
                alert(res.data.msg);
                console.log('officer add error');
            }
        } catch (err) {
            console.log('officer add error', err);
        }
    }

    async function handleEditOfficer(event) {
        event.preventDefault();
        const formData = new FormData();

        for (const key in newOfficer) {
            if (key !== 'password' || (key === 'password' && newOfficer[key])) {
                formData.append(key, newOfficer[key]);
            }
        }

        try {
            const res = await axios.put(`${serverUrl}/api/updateOfficer/${selectedOfficerId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data.success) {
                alert(res.data.msg);
                setEdit(false);
                setType(true);
                fetchOfficers();
                resetForm();
            } else {
                alert(res.data.msg);
                console.log('officer edit error');
            }
        } catch (err) {
            console.log('officer edit error', err);
        }
    }

    function handleChange(event) {
        const { name, value, type, files } = event.target;
        if (type === 'file') {
            setNewOfficer(prevState => ({
                ...prevState,
                [name]: files[0],
            }));
        } else {
            setNewOfficer(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    function handleChangeView(newType) {
        setType(newType);
        if (newType) fetchOfficers();
        resetForm(); // Reset form when switching views
    }

    function handleEdit(officer) {
        setEdit(true);
        setType(false);
        setSelectedOfficerId(officer._id);

        // Exclude password from the officer object when setting for editing
        const { password, ...officerWithoutPassword } = officer;
        setNewOfficer(officerWithoutPassword);
    }

    function resetForm() {
        setNewOfficer({
            name: '',
            email: '',
            district: '',
            password: '',
            image: null,
        });
        setSelectedOfficerId(null);
        setEdit(false); // Exit edit mode if editing
    }

    async function handleDelete(id) {
        try {
            const res = await axios.delete(`${serverUrl}/api/deleteOfficer/${id}`);
            if (res.data.success) {
                alert(res.data.msg);
                fetchOfficers();
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-1 pt-14">
                <Sidebar />
                <div className="flex-1 p-4 ml-44 max-md:ml-0">
                    {/* Tabs */}
                    <div className="relative bg-gray-100">
                        <div className="flex space-x-1">
                            <button
                                className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${type ? 'bg-blue-500 text-white rounded-t-lg border-b-2 border-blue-500' : 'bg-white text-blue-500'}`}
                                onClick={() => handleChangeView(true)}
                            >
                                View
                            </button>
                            <button
                                className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${!type ? 'bg-blue-500 text-white rounded-t-lg border-b-2 border-blue-500' : 'bg-white text-blue-500'}`}
                                onClick={() => handleChangeView(false)}
                            >
                                {edit ? 'Edit' : 'Add'}
                            </button>
                        </div>

                        {/* Content Container */}
                        <div className="bg-white shadow mt-0">
                            <div className="p-4">
                                {type ? (
                                    // View Officers
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {officers.map(officer => (
                                                    <tr key={officer._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><img src={`https://safe-bite.vercel.app/${officer.image}`} className="rounded-full w-10 h-10" /></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{officer.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.district}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button onClick={() => handleEdit(officer)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                                            <button onClick={() => handleDelete(officer._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    // Add or Edit Officer Form
                                    <div>
                                        <form onSubmit={edit ? handleEditOfficer : handleAddOfficer} className="space-y-4 max-w-md mx-auto">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={newOfficer.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                                required
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={newOfficer.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="district"
                                                placeholder="District"
                                                value={newOfficer.district}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                                required
                                            />
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={edit !== true ? newOfficer.password : ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                                required={edit !== true}
                                            />
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                                required={edit !== true}
                                            />
                                            <div className="flex space-x-4">
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    {edit ? 'Save Officer' : 'Add Officer'}
                                                </button>
                                                {edit && (
                                                    <button
                                                        type="button"
                                                        onClick={resetForm}
                                                        className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
