import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { mycontext } from '../Context/MyContext';
import { useNavigate } from 'react-router-dom';

export const Permissions = () => {
    const { setEmail, setId, setName } = useContext(mycontext)
    const [activeTab, setActiveTab] = useState('Requests');
    const [officers, setOfficers] = useState([]);

    const nav = useNavigate()

    const serverUrl = 'https://safe-bite.vercel.app';

    useEffect(() => {
        fetchOfficers();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/getofficer`);
            if (response.data.success) {
                setOfficers(response.data.officers);
            }
        } catch (err) {
            console.error('Error fetching officers:', err);
        }
    };

    const handleDownload = (fileUrl, fileName) => {
        saveAs(fileUrl, fileName);
    };

    function handleMessage(inId, inEmail, inName) {
        setId(inId)
        setEmail(inEmail)
        setName(inName)
        nav('/adminNoti')
    }



    const requests = officers.filter(officer => officer.permission && officer.permission.length > 0);
    const reports = officers.filter(officer => officer.document && officer.document.length > 0);

    const handleGrant = async (id, permId, status) => {
        try {
            const response = await axios.post(`${serverUrl}/api/permissiongrant`, {
                officerId: id,
                permissionId: permId,
                status: status,
            });

            if (response.data.success) {
                alert(response.data.msg);
            } else {
                console.log(response.data.msg);
            }
        } catch (err) {
            console.log('Permission error', err);
        }
    };

    return (
        <div>
            <Navbar />
            <Sidebar />

            <div className="bg-white ml-64 mt-20 mr-8 shadow-md rounded-lg max-md:ml-4">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'Requests' ? 'bg-blue-500 text-white' : 'text-blue-500'} border-b-2 border-transparent hover:border-blue-500`}
                        onClick={() => setActiveTab('Requests')}
                    >
                        Requests
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'Reports' ? 'bg-blue-500 text-white' : 'text-blue-500'} border-b-2 border-transparent hover:border-blue-500`}
                        onClick={() => setActiveTab('Reports')}
                    >
                        Reports
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'Requests' && (
                        <div>
                            {requests.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">Inspector Name</th>
                                                <th className="py-3 px-6 text-left">Permission Title</th>
                                                <th className="py-3 px-6 text-left">Details</th>
                                                <th className="py-3 px-6 text-left">Date</th>
                                                <th className="py-3 px-6 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {requests.map((officer, index) => (
                                                officer.permission.map((perm, permIndex) => (
                                                    <tr key={`${index}-${permIndex}`} className="border-b border-gray-200">
                                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                                            <span className="font-medium">{officer.name}</span>
                                                        </td>
                                                        <td className="py-3 px-6 text-left">
                                                            <span>{perm.title}</span>
                                                        </td>
                                                        <td className="py-3 px-6 text-left">
                                                            <span>{perm.details}</span>
                                                        </td>
                                                        <td className="py-3 px-6 text-left">
                                                            <span>{new Date(perm.date).toLocaleDateString()}</span>
                                                        </td>
                                                        <td className="py-3 px-6 text-left">
                                                            <button
                                                                className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:bg-green-600"
                                                                onClick={() => handleGrant(officer._id, perm._id, 'Granted')}
                                                            >
                                                                {perm.status === 'Granted' ? 'Granted' : 'Grant'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600">No permission requests available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'Reports' && (
                        <div>
                            {reports.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">Inspector Name</th>
                                                <th className="py-3 px-6 text-left">Email</th>
                                                <th className="py-3 px-6 text-left">Report</th>
                                                <th className="py-3 px-6 text-left">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {reports.map((officer, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                                        <span className="font-medium">{officer.name}</span>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        <span>{officer.email}</span>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            onClick={() => handleDownload(`http://localhost:5000/${officer.document}`, officer.document)}
                                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                                        >
                                                            Download
                                                        </button>
                                                    </td>

                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            onClick={() => handleMessage(officer._id, officer.email, officer.name)}
                                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                                        >
                                                            Message
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600">No reports available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Permissions;
