import React, { useState, useEffect } from 'react';
import { UserNavbar } from "./UserNavbar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [edit, setEdit] = useState(false);

    const serverUrl = 'http://localhost:5000';
    const userId = localStorage.getItem('userID');
    const nav = useNavigate();

    useEffect(() => {

        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const res = await axios.get(`${serverUrl}/api/fetchuser/${userId}`);
            if (res.data.success) {
                setUser(res.data.user);
                setName(res.data.user.name);
                setEmail(res.data.user.email);
            } else {
                console.log(res.data.msg);
            }
        } catch (err) {
            console.error('User fetch error:', err);
        }
    }

    async function handleUpdate() {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            if (password) formData.append('password', password);
            if (image) formData.append('image', image);

            const res = await axios.put(`${serverUrl}/api/updateUserStatus/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                alert('Updated successfully');
                setEdit(false);
                setPassword('');
                fetchUser();
            } else {
                console.log('Error occurred');
            }
        } catch (err) {
            console.log('Update error:', err);

        }
    }

    function handleCancel() {
        setEdit(false);
        setPassword('');
    }

    function handleImageChange(e) {
        setImage(e.target.files[0]);
    }

    async function handleDelete() {
        try {
            const res = await axios.delete(`${serverUrl}/api/deleteuser/${userId}`);

            if (res.data.success) {
                alert(res.data.msg);
                localStorage.clear();
                nav('/');
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('delete error:', err);
        }
    }

    return (
        <div>
            <UserNavbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md">
                    {user ? (
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src={`http://localhost:5000/${user.image}`}
                                    alt="User"
                                    className="rounded-full w-24 h-24 object-cover border-2 border-blue-500"
                                />
                                <button
                                    onClick={() => setEdit(true)}
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                                    title="Edit Profile"
                                >
                                    ✏️
                                </button>
                            </div>
                            {!edit ? (
                                <>
                                    <h2 className="text-xl font-bold mt-4">{user.name}</h2>
                                    <p className="text-gray-600 mt-1">{user.email}</p>
                                    <div className="mt-4 flex space-x-3">
                                        <button
                                            onClick={() => setEdit(true)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-4 w-full">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password (if changing)"
                                        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleUpdate}
                                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};
