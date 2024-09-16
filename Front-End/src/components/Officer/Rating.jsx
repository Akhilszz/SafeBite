import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation } from "./Navigation";

export const Rating = () => {
    const [hotels, setHotels] = useState([]);
    const [rating, setRating] = useState(false);
    const [id, setId] = useState(0);
    const [rate, setRate] = useState('');
    const serverUrl = 'http://localhost:5000';
    const authToken = localStorage.getItem('authTokenOfficer')
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
                        hotel.address.some(addr => addr.district === district)
                    )
                );
            }
        } catch (err) {
            console.error('Fetching error:', err);
        }
    }

    function handleRating(id) {
        setRating(!rating);
        setId(id);
    }

    async function handleSave(id) {
        try {
            const res = await axios.post(`${serverUrl}/api/request/${id}`, {
                rating: rate,
            });
            if (res.data.success) {
                fetchHotel();
                setRate('');
                setRating(false);
            } else {
                console.log(res.data.msg);
                console.log('Update error');
            }
        } catch (err) {
            console.log('Update error', err);
        }
    }

    function handleCancel() {
        setRating(false);
    }

    return (
        <div className="flex">
            <Navigation />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen mt-5 ml-60 max-md:ml-0">
                <div className="mt-8">
                    {hotels.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {hotels.map((data) => (
                                <div key={data._id} className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                    <img
                                        src={`http://localhost:5000/${data.image}`}
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
                                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        {rating && data._id === id ? (
                                            <div className="flex flex-col items-start gap-4">
                                                <select
                                                    onChange={(e) => setRate(e.target.value)}
                                                    value={rate}
                                                    className="mb-2 p-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="">Select Grade</option>
                                                    <option value="Grade A">Grade A</option>
                                                    <option value="Grade B">Grade B</option>
                                                    <option value="Grade C">Grade C</option>
                                                    <option value="Grade D">Grade D</option>
                                                    <option value="Grade E">Grade E</option>
                                                </select>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleSave(data._id)}
                                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRating(data._id)}
                                                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                                            >
                                                Add Grade
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No hotels found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rating;
