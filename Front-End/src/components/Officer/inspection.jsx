import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import axios from 'axios';

export const Inspection = () => {
    const [hotels, setHotels] = useState([]);
    const [details, setDetails] = useState('');
    const [id, setID] = useState('');
    const [error, setError] = useState('');

    const serverUrl = 'https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app'
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
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                setHotels(res.data.Hotel.filter(hotel =>
                    hotel.address.some(addr => addr.district === district)
                ));
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }

    const handleHotel = async () => {
        setError('');

        // Validation
        if (!id) {
            setError('Please select a hotel.');
            return;
        }
        if (!details.trim()) {
            setError('Please enter inspection details.');
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/inspection`, {
                officerId: officerID,
                hotelId: id,
                inspection: details,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                alert(res.data.msg);
                setDetails('');
                setID('');
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('error', err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navigation />

            <div className="flex-1 p-6 mt-28 ml-44 md:ml-60 max-lg:ml-0">
                {/* Tabs */}
                <div className="bg-white shadow-md rounded-lg">
                    <button
                        className="py-2 px-4 text-sm font-semibold rounded-t-lg bg-blue-700 text-white border-b-2 border-blue-700"
                    >
                        Inspection Details
                    </button>
                </div>

                {/* Content Container */}
                <div className="bg-white shadow-md rounded-b-lg p-6 mt-[-1px]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-300 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col space-y-4">
                        <select
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setID(e.target.value)}
                            value={id}
                        >
                            <option value="">Select Hotel</option>
                            {hotels.map(data =>
                                <option key={data._id} value={data._id}>{data.name}</option>
                            )}
                        </select>
                        <textarea
                            value={details}
                            placeholder="Enter inspection details"
                            onChange={(e) => setDetails(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        />
                        <button
                            onClick={handleHotel}
                            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
