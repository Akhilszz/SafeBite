import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";
import { mycontext } from '../Context/MyContext';
import { useNavigate } from 'react-router-dom';

export const Tasks = () => {
    const [activeTab, setActiveTab] = useState('DocumentApproval');
    const [taskData, setTaskData] = useState([]);
    const [lice, setLice] = useState('');
    const [selectedHotelId, setSelectedHotelId] = useState(null);
    const [officers, setOfficers] = useState([]);
    const [errors, setErrors] = useState({ licenseNumber: '' }); // Validation state

    const { setEmail, setId, setName } = useContext(mycontext);
    const serverURL = 'https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app'

    const nav = useNavigate();

    const handleDownload = (fileUrl, fileName) => {
        saveAs(fileUrl, fileName);
    };

    useEffect(() => {
        fetchTaskData();
        fetchOfficer();
    }, []);

    async function fetchTaskData() {
        try {
            const res = await axios.get(`${serverURL}/api/GetHotel`);
            if (res.data.success) {
                setTaskData(res.data.Hotel);
            }
        } catch (err) {
            console.error('Fetch error', err);
        }
    }

    async function fetchOfficer() {
        try {
            const res = await axios.get(`${serverURL}/api/getofficer`);
            if (res.data.success) {
                setOfficers(res.data.officers);
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    const Hotels = taskData.filter(data => data.status === 'verified' || data.status === 'approved' || data.status === 'generated' || data.status === 'rejected');
    const licen = taskData.filter(data => data.status === 'approved');

    async function handleAction(id, state, licenseNumber) {
        try {
            const res = await axios.post(`${serverURL}/api/request/${id}`, {
                status: state,
                liceno: licenseNumber
            });
            if (res.data.success) {
                alert(`${state} successfully`);
                fetchTaskData();
                setSelectedHotelId(null);
            } else {
                console.log(res.data.msg);
                console.log('Update error');
            }
        } catch (err) {
            console.log('Update error', err);
        }
    }

    const handleGenerateClick = (id) => {
        setSelectedHotelId(id);
        setErrors({ licenseNumber: '' }); // Reset errors
    };

    const handleSaveClick = (id) => {
        if (!validateLicenseNumber()) return; // Validate before saving
        handleAction(id, 'generated', lice);
    };

    // Validation function for license number
    const validateLicenseNumber = () => {
        let isValid = true;
        const newErrors = { licenseNumber: '' };

        if (!lice.trim()) {
            newErrors.licenseNumber = 'License number is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    function handleMessage(inEmail) {
        const update = taskData.filter(data => data.email === inEmail);
        const district = update.flatMap(data =>
            data.address
                .filter(addr => addr.district)
                .map(addr => addr.district)
        );

        const matchedOfficer = officers.filter(officer =>
            district.some(district => officer.district.toLowerCase() === district.toLowerCase())
        );

        const officerEmail = matchedOfficer[0].email;
        const officerName = matchedOfficer[0].name;
        const officerId = matchedOfficer[0]._id;

        setEmail(officerEmail);
        setName(officerName);
        setId(officerId);

        nav('/adminNoti');
    }

    return (
        <div>
            <Navbar />
            <Sidebar />

            <div className="bg-white ml-64 mt-20 mr-8 shadow-md rounded-lg max-md:ml-4">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'DocumentApproval' ? 'bg-blue-500 text-white' : 'text-blue-500'} border-b-2 border-transparent hover:border-blue-500`}
                        onClick={() => setActiveTab('DocumentApproval')}
                    >
                        Document Approval
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'LicenseGeneration' ? 'bg-blue-500 text-white' : 'text-blue-500'} border-b-2 border-transparent hover:border-blue-500`}
                        onClick={() => setActiveTab('LicenseGeneration')}
                    >
                        License Generation
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'DocumentApproval' && (
                        <div>
                            {Hotels.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">Name</th>
                                                <th className="py-3 px-6 text-left">Address</th>
                                                <th className="py-3 px-6 text-left">Documents</th>
                                                <th className="py-3 px-6 text-left">Status</th>
                                                <th className="py-3 px-6 text-left">Actions</th>
                                                <th className="py-3 px-6 text-left">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {Hotels.map((data, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">{data.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {data.address.map((add, i) => (
                                                            <div key={i} className="mb-1">
                                                                <p>{`${add.city.toUpperCase()}, ${add.district.toUpperCase()}, ${add.state.toUpperCase()}, ${add.pincode.toUpperCase()}`}</p>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            onClick={() => handleDownload(`http://localhost:5000/${data.document}`, data.document)}
                                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                                        >
                                                            Download
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {data.status === 'rejected' ? (
                                                            <p className="bg-red-500 text-white text-center py-1 px-3 rounded hover:bg-red-600">
                                                                Rejected
                                                            </p>
                                                        ) : data.status === 'verified' ? (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Verified
                                                            </p>
                                                        ) : data.status === 'approved' ? (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Approved
                                                            </p>
                                                        ) : data.status === 'generated' ? (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Generated
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        <div className="inline-flex">
                                                            <button
                                                                className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:bg-green-600"
                                                                onClick={() => handleAction(data._id, 'approved')}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                                                onClick={() => handleAction(data._id, 'rejected')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            onClick={() => handleMessage(data.email)}
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
                                <p>No tasks found.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'LicenseGeneration' && (
                        <div>
                            {licen.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">Name</th>
                                                <th className="py-3 px-6 text-left">Address</th>
                                                <th className="py-3 px-6 text-left">Documents</th>
                                                <th className="py-3 px-6 text-left">Status</th>
                                                <th className="py-3 px-6 text-left">License No.</th>
                                                <th className="py-3 px-6 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {licen.map((data, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">{data.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {data.address.map((add, i) => (
                                                            <div key={i} className="mb-1">
                                                                <p>{`${add.city.toUpperCase()}, ${add.district.toUpperCase()}, ${add.state.toUpperCase()}, ${add.pincode.toUpperCase()}`}</p>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        <button
                                                            onClick={() => handleDownload(`http://localhost:5000/${data.document}`, data.document)}
                                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                                        >
                                                            Download
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {data.status === 'approved' ? (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Approved
                                                            </p>
                                                        ) : data.status === 'generated' ? (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Generated
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {selectedHotelId === data._id ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    placeholder="License No."
                                                                    value={lice}
                                                                    onChange={(e) => setLice(e.target.value)}
                                                                    className="border rounded px-3 py-1"
                                                                />
                                                                {errors.licenseNumber && (
                                                                    <p className="text-red-500 text-sm">
                                                                        {errors.licenseNumber}
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            data.liceno
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {selectedHotelId === data._id ? (
                                                            <button
                                                                onClick={() => handleSaveClick(data._id)}
                                                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                                            >
                                                                Save
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleGenerateClick(data._id)}
                                                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                                            >
                                                                Generate
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No licenses found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
