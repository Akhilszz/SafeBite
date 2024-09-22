import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import axios from 'axios';

export const OffiFeedback = () => {
    const [activeTab, setActiveTab] = useState('inspectionRequests');
    const [hotels, setHotels] = useState([]);
    const [showComplaints, setShowComplaints] = useState({}); // Track visibility for complaints per hotel

    const serverUrl = 'https://safe-bite.vercel.app'
    const authToken = localStorage.getItem('authTokenOfficer');
    const officerID = localStorage.getItem('officerID');
    const district = localStorage.getItem('officerDistrict');

    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.get(`${serverUrl}/api/GetHotel`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (res.data.success) {
                setHotels(res.data.Hotel.filter(hotel =>
                    hotel.address.some(addr => addr.district === district)
                ));
                console.log(res.data.msg);
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    const toggleComplaints = (hotelId) => {
        setShowComplaints((prevState) => ({
            ...prevState,
            [hotelId]: !prevState[hotelId],
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="w-full ml-72 mt-20 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg max-md:ml-0">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab('inspectionRequests')}
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'inspectionRequests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                        Complaints
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'inspectionRequests' && (
                        <div className="space-y-6">
                            {hotels.map((hotel) => (
                                <div key={hotel._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        Hotel Name: {hotel.name}
                                    </h2>

                                    <p className="text-gray-800 font-medium mb-2">
                                        Complaints ({hotel.complaints.length})
                                    </p>
                                    <button
                                        onClick={() => toggleComplaints(hotel._id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {showComplaints[hotel._id] ? 'Hide Complaints' : 'View Complaints'}
                                    </button>

                                    {/* Show complaints only when 'View Complaints' is clicked */}
                                    {showComplaints[hotel._id] && (
                                        <div className="mt-4 space-y-4">
                                            {hotel.complaints.map((complaint, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
                                                    <p className="text-gray-800 font-medium mb-2">Complaint:</p>
                                                    <p className="text-gray-700 mb-4">{complaint.complaint}</p>
                                                    <div className="mb-4">
                                                        <p className="text-gray-800 font-medium mb-2">Proof:</p>
                                                        <img
                                                            src={complaint.proof}
                                                            alt="Proof"
                                                            className="w-full h-auto max-w-xs border border-gray-200 rounded-md"
                                                        />
                                                    </div>
                                                    <p className="text-gray-600 text-sm">
                                                        Date Submitted: {new Date(complaint.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
