import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Nav } from './Nav';

export const HotelFeedback = () => {
    const [hotel, setHotel] = useState(null);
    const [activeTab, setActiveTab] = useState('complaints');
    const [replyText, setReplyText] = useState('');
    const [replyTarget, setReplyTarget] = useState(null); // Track which item to reply to
    const serverURL = 'https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app'
    const Email = localStorage.getItem('hotelEmail');

    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.post(`${serverURL}/api/fetchhotel`, { email: Email });
            if (res.data.success) {
                setHotel(res.data.hotel[0]); // Assuming there's only one hotel in the response
            }
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    async function handleReplySubmit() {
        if (!replyText || !replyTarget) return;

        try {
            const endpoint = activeTab === 'complaints' ? '/api/replyComplaint' : '/api/replySuggestion';
            const res = await axios.post(`${serverURL}${endpoint}`, {
                hotelId: hotel._id,
                itemId: replyTarget._id,
                reply: replyText
            });

            if (res.data.success) {
                // Update state to reflect the new reply
                fetchHotel(); // Fetch the updated hotel data
                setReplyText(''); // Clear the input
                setReplyTarget(null); // Clear the reply target
            }
        } catch (err) {
            console.log('reply error', err);
        }
    }

    const complaints = hotel ? hotel.complaints || [] : [];
    const suggestions = hotel ? hotel.suggestions || [] : [];

    const handleReplyClick = (item) => {
        setReplyTarget(item);
        setReplyText(''); // Clear any previous text
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-12">
            <Nav />
            <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg mt-10">
                <div>
                    <div className="flex border-b border-gray-300">
                        <button
                            className={`flex-1 py-2 text-center font-semibold ${activeTab === 'complaints' ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('complaints')}
                        >
                            Complaints
                        </button>
                        <button
                            className={`flex-1 py-2 text-center font-semibold ${activeTab === 'suggestions' ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('suggestions')}
                        >
                            Suggestions
                        </button>
                    </div>
                    <div className="p-4">
                        {activeTab === 'complaints' && (
                            <div>
                                {complaints.length > 0 ? (
                                    <ul className=" list-inside space-y-2">
                                        {complaints.map((comp) => (
                                            <li key={comp._id} className="p-2 border border-gray-200 rounded-md bg-gray-50">
                                                <div><strong>Complaint:</strong> {comp.complaint}</div>
                                                <div><strong>Date:</strong> {new Date(comp.date).toLocaleDateString()}</div>
                                                <div><strong>Reply:</strong> {comp.reply || 'No reply yet'}</div>
                                                <button
                                                    onClick={() => handleReplyClick(comp)}
                                                    className="mt-2 text-blue-500"
                                                >
                                                    Reply
                                                </button>
                                                {replyTarget && replyTarget._id === comp._id && (
                                                    <div className="mt-4">
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            rows="3"
                                                            className="w-full border border-gray-300 p-2 rounded-md"
                                                            placeholder="Enter your reply here..."
                                                            required
                                                        />
                                                        <button
                                                            onClick={handleReplySubmit}
                                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                                        >
                                                            Submit Reply
                                                        </button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No complaints available.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'suggestions' && (
                            <div>
                                {suggestions.length > 0 ? (
                                    <ul className=" list-inside space-y-2">
                                        {suggestions.map((sug) => (
                                            <li key={sug._id} className="p-2 border border-gray-200 rounded-md bg-gray-50">
                                                <div><strong>Suggestion:</strong> {sug.suggestion}</div>
                                                <div><strong>Date:</strong> {new Date(sug.date).toLocaleDateString()}</div>
                                                <div><strong>Reply:</strong> {sug.reply || 'No reply yet'}</div>
                                                <button
                                                    onClick={() => handleReplyClick(sug)}
                                                    className="mt-2 text-blue-500"
                                                >
                                                    Reply
                                                </button>
                                                {replyTarget && replyTarget._id === sug._id && (
                                                    <div className="mt-4">
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            rows="3"
                                                            className="w-full border border-gray-300 p-2 rounded-md"
                                                            placeholder="Enter your reply here..."
                                                            required
                                                        />
                                                        <button
                                                            onClick={handleReplySubmit}
                                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                                        >
                                                            Submit Reply
                                                        </button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No suggestions available.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
