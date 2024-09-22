import { useEffect, useState } from "react";
import axios from 'axios';
import { UserNavbar } from "./UserNavbar";

export const Suggetions = () => {
    const [hotels, setHotels] = useState([]);
    const [suggestion, setSuggestion] = useState('');
    const [selectedHotelId, setSelectedHotelId] = useState('');

    const serverURL = 'https://safe-bite.vercel.app'
    const userID = localStorage.getItem('userID')

    useEffect(() => {
        fetchHotels();
    }, []);

    async function fetchHotels() {
        try {
            const res = await axios.get(`${serverURL}/api/GetHotel`);
            if (res.data.success) {
                setHotels(res.data.Hotel.filter(data => data.status === 'generated' && !data.blacklist));
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const res = await axios.post(`${serverURL}/api/sendSuggestion`, {
                userId: userID,
                hotelId: selectedHotelId,
                suggestion: suggestion
            });

            if (res.data.success) {
                alert(res.data.msg);
                setSuggestion('');
                setSelectedHotelId('');
            } else {
                alert(res.data.msg);
            }
        } catch (err) {
            console.log('submit error', err);
        }
    }

    return (
        <div>
            <UserNavbar />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit a Suggestion</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="hotel" className="block text-lg font-medium text-gray-700 mb-2">Select Hotel</label>
                            <select
                                id="hotel"
                                value={selectedHotelId}
                                onChange={(e) => setSelectedHotelId(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                            >
                                <option value="" disabled>Select a hotel</option>
                                {hotels.map(hotel => (
                                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="suggestion" className="block text-lg font-medium text-gray-700 mb-2">Suggestion</label>
                            <textarea
                                id="suggestion"
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                                placeholder="Enter your suggestion here..."
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 bg-white"
                                rows="6"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
