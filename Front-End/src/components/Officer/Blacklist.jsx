import { useEffect, useState } from "react";
import axios from 'axios';
import { Navigation } from "./Navigation";

export const Blacklist = () => {
    const [hotels, setHotels] = useState([]);
    const [type, setType] = useState('approved');
    const [view, setView] = useState(false);
    const [com, setComp] = useState([]);
    const [id, setID] = useState(null); // Use null initially
    const [blist, setBlist] = useState(true);
    const [status, setStatus] = useState(false);
    const [penalty, setPenalty] = useState(0);

    const serverUrl = 'https://safe-bite.vercel.app'
    const authToken = localStorage.getItem('authTokenOfficer');
    const district = localStorage.getItem('officerDistrict');

    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.get(`${serverUrl}/api/GetHotel`, {
                headers: {
                    Authorization: `Bearer ${authToken}` // Ensure 'Bearer ' prefix is included
                }
            });
            if (res.data.success) {
                setHotels(
                    res.data.Hotel.filter(hotel =>
                        hotel.status === 'generated' &&
                        hotel.address.some(addr => addr.district.toLowerCase() === district.toLowerCase())
                    )
                );


            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    const hotelApproved = hotels.filter(data => data.blacklist === false);
    const hotelBlacklisted = hotels.filter(data => data.blacklist === true);

    function handleChange(newType) {
        setType(newType);
    }

    async function handleView(id) {
        try {
            const response = await axios.get(`${serverUrl}/api/blacklistcom/${id}`);
            if (response.data.success) {
                setComp(response.data.complaints); // Ensure you're setting the complaints array
                setID(id);
                setView(!view);
            }
        } catch (err) {
            console.error('Error fetching complaints', err);
        }
    }

    async function handleBlacklist(id, state) {
        setBlist(state);
        try {
            const res = await axios.put(`${serverUrl}/api/blacklist/${id}`, {
                blacklist: state,
            });

            if (res.data.success) {
                fetchHotel();
                setView(false);
            } else {
                console.log('Update error:', res.data.msg);
            }
        } catch (err) {
            console.log('Update error:', err);
        }
    }

    async function handlePenalty(id) {
        try {
            const res = await axios.put(`${serverUrl}/api/blacklist/${id}`, {
                penalty: penalty,
            });

            if (res.data.success) {
                fetchHotel();
                setView(false);
                setStatus(!status);
            } else {
                console.log('Update error:', res.data.msg);
            }
        } catch (err) {
            console.log('Update error:', err);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navigation />

            <div className="flex-1 p-6 mt-28 ml-44 md:ml-60 max-lg:ml-0">
                {/* Tabs */}
                <div className="relative bg-white shadow-md rounded-lg mb-4">
                    <div className="flex space-x-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
                        <button
                            className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${type === 'approved' ? 'bg-blue-700 text-white border-b-2 border-blue-700' : 'bg-white text-blue-700'}`}
                            onClick={() => handleChange('approved')}
                        >
                            Approved
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-semibold rounded-t-lg ${type === 'blacklisted' ? 'bg-blue-700 text-white border-b-2 border-blue-700' : 'bg-white text-blue-700'}`}
                            onClick={() => handleChange('blacklisted')}
                        >
                            Blacklisted
                        </button>
                    </div>

                    {/* Content Container */}
                    <div className="bg-white shadow-md rounded-b-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(type === 'approved' ? hotelApproved : hotelBlacklisted).map(data => (
                                <div key={data._id} className="bg-white shadow-lg rounded-lg border border-gray-300 p-4 flex flex-col items-center">
                                    <img src={data.image} alt="hotel" className="w-full h-36 object-cover rounded mb-4" />
                                    <h1 className="text-lg font-semibold mb-1">{data.name}</h1>
                                    <h3 className="text-sm text-gray-700 mb-1">Email: {data.email}</h3>
                                    <div className="text-sm">
                                        <h3 className="font-semibold">Address:</h3>
                                        {data.address.map((addr, index) => (
                                            <div key={index} className="mb-2">
                                                <p>{addr.city.toUpperCase()}, {addr.district.toUpperCase()}, {addr.state.toUpperCase()}, {addr.pincode.toUpperCase()}</p>
                                                <p><strong>Phone:</strong> {addr.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="text-sm text-gray-700 mb-4">No. Of Complaints: {data.complaints.length}</h3>
                                    {data.penalty > 0 ?
                                        <h3 className="text-sm text-gray-700 mb-4">Penalty: {data.penalty}</h3> :
                                        ''
                                    }
                                    {status === true ? (
                                        <div>
                                            <input type="number" onChange={(e) => setPenalty(e.target.value)} placeholder="Enter Penalty amount" />
                                        </div>
                                    ) : ''}
                                    <div className="flex flex-col items-center space-y-2 mt-auto">
                                        {type === 'approved' && (
                                            <div className="flex flex-col space-y-2 w-full">
                                                <div className="flex justify-between space-x-2 w-full">
                                                    <button
                                                        onClick={() => handleBlacklist(data._id, true)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                    >
                                                        BlackList
                                                    </button>
                                                    <button
                                                        onClick={() => handleView(data._id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        {view === true && data._id === id ? 'Hide Complaints' : 'View Complaints'}
                                                    </button>
                                                </div>
                                                {view === true && data._id === id && (
                                                    <ul className="mt-2 text-sm text-gray-700 w-full space-y-1">
                                                        {com.map((complaint, index) => (
                                                            <li key={complaint._id} className="bg-gray-100 p-2 rounded-lg">
                                                                <p><strong>Complaint:</strong> {complaint.complaint}</p>
                                                                {complaint.reply && <p><strong>Reply:</strong> {complaint.reply}</p>}
                                                                <p><small>Date: {new Date(complaint.date).toLocaleDateString()}</small></p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                        {type === 'blacklisted' && (
                                            <div className="flex gap-6">
                                                <button
                                                    onClick={() => handleBlacklist(data._id, false)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mt-auto"
                                                >
                                                    Remove
                                                </button>
                                                {status === true ? (
                                                    <button
                                                        onClick={() => handlePenalty(data._id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-auto"
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setStatus(!status)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-auto"
                                                    >
                                                        Add Penalty
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
