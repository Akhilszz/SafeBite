import { useContext, useEffect, useState } from "react";
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Navigation } from "./Navigation";
import { mycontext } from "../Context/MyContext";
import { useNavigate } from "react-router-dom";

export const Request = () => {
    const [hotels, setHotels] = useState([]);
    const [activeTab, setActiveTab] = useState('registration');
    const [error, setError] = useState('');

    const { setId, setName } = useContext(mycontext);

    const serverUrl = 'https://safe-bite.vercel.app'
    const authToken = localStorage.getItem('authTokenOfficer');
    const district = localStorage.getItem('officerDistrict');

    const nav = useNavigate();

    useEffect(() => {
        fetchHotel();
    }, []);

    const handleDownload = (fileUrl, fileName) => {
        saveAs(fileUrl, fileName);
    };

    async function fetchHotel() {
        try {
            const res = await axios.get(`${serverUrl}/api/GetHotel`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                setHotels(res.data.Hotel.filter(hotel =>
                    hotel.address.some(addr => addr.district === district)
                ));
            } else {
                setError('Failed to fetch hotels.');
            }
        } catch (err) {
            console.error('Fetching error', err);
            setError('An error occurred while fetching hotels.');
        }
    }

    function handleChange(tab) {
        setActiveTab(tab);
        setError(''); // Clear error when switching tabs
    }

    async function handleApprove(id, state) {
        try {
            const res = await axios.post(`${serverUrl}/api/request/${id}`, { request: state }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                fetchHotel();
            } else {
                setError(res.data.msg || 'Update failed.');
            }
        } catch (err) {
            console.error('Update error', err);
            setError('An error occurred while updating request.');
        }
    }

    async function handleAction(id, state) {
        try {
            const res = await axios.post(`${serverUrl}/api/request/${id}`, { status: state }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                alert(`${state} successfully`);
                fetchHotel();
            } else {
                setError(res.data.msg || 'Action failed.');
            }
        } catch (err) {
            console.error('Action error', err);
            setError('An error occurred while performing action.');
        }
    }

    function handleMessage(id, name) {
        setName(name);
        setId(id);
        nav('/notification');
    }

    const registrationData = hotels.filter(data => data.request === 'request' || data.request === 'approved');
    const documentVerificationData = hotels.filter(data =>
        ['uploaded', 'rejected', 'verified', 'approved', 'generated'].includes(data.status)
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="p-6 ml-60 max-md:ml-0">
                <h1 className="text-2xl font-semibold mb-4">Requests</h1>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}
                <div className="flex border-b border-gray-300 mb-4">
                    <button
                        className={`flex-1 py-2 text-center font-semibold ${activeTab === 'registration' ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleChange('registration')}
                    >
                        Registration
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-semibold ${activeTab === 'document' ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handleChange('document')}
                    >
                        Document Verification
                    </button>
                </div>

                <div className="p-4 bg-white shadow-md rounded-lg">
                    {activeTab === 'registration' && (
                        <div>
                            {registrationData.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {registrationData.map(data => (
                                        <div key={data._id} className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                            <img
                                                src={`https://safe-bite.vercel.app/${data.image}`}
                                                alt="hotel"
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="p-4">
                                                <h1 className="text-xl font-semibold text-gray-800 mb-2">{data.name}</h1>
                                                <h3 className="text-sm text-gray-600 mb-2">Email: {data.email}</h3>
                                                <div className="text-sm text-gray-600 mb-4">
                                                    <h3 className="font-semibold mb-1">Address:</h3>
                                                    {data.address.map((addr, index) => (
                                                        <div key={index} className="mb-2">
                                                            <p>{addr.city.toUpperCase()}, {addr.district.toUpperCase()}, {addr.state.toUpperCase()}, {addr.pincode.toUpperCase()}</p>
                                                            <p><strong>Phone:</strong> {addr.phone}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <h2 className="text-lg font-semibold text-gray-700">Grade: {data.rating || 'Not Rated'}</h2>
                                            </div>
                                            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                                                {data.request === 'request' && (
                                                    <button
                                                        onClick={() => handleApprove(data._id, 'approved')}
                                                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {data.request === 'approved' && (
                                                    <button
                                                        onClick={() => handleApprove(data._id, 'request')}
                                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No registrations available.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'document' && (
                        <div>
                            {documentVerificationData.length > 0 ? (
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
                                            {documentVerificationData.map((data, index) => (
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
                                                            onClick={() => handleDownload(`https://safe-bite.vercel.app/${data.document}`, data.document)}
                                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                                        >
                                                            Download
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {data.status === 'rejected' && (
                                                            <p className="bg-red-500 text-white text-center py-1 px-3 rounded hover:bg-red-600">
                                                                Rejected
                                                            </p>
                                                        )}
                                                        {data.status === 'verified' && (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Verified
                                                            </p>
                                                        )}
                                                        {data.status === 'approved' && (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Approved
                                                            </p>
                                                        )}
                                                        {data.status === 'generated' && (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Generated
                                                            </p>
                                                        )}
                                                        {data.status === 'uploaded' && (
                                                            <p className="bg-green-500 text-white text-center py-1 px-3 rounded hover:bg-green-600">
                                                                Uploaded
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        <div className="inline-flex">
                                                            <button
                                                                className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:bg-green-600"
                                                                onClick={() => handleAction(data._id, 'verified')}
                                                            >
                                                                Verify
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
                                                            onClick={() => handleMessage(data._id, data.name)}
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
                                <p className="text-gray-600">No document verification requests available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Request;
