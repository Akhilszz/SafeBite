import { UserNavbar } from "./UserNavbar";
import { useState, useEffect } from "react";
import axios from 'axios';

export const UserNoti = () => {
    const [activeTab, setActiveTab] = useState('inspector');
    const [inspectorData, setInspectorData] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const serverURL = 'https://safe-bite.vercel.app'
    const userID = localStorage.getItem('userID');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    async function fetchData() {
        try {
            if (activeTab === 'inspector') {
                const res = await axios.get(`${serverURL}/api/getnotification`);
                if (res.data.success) {
                    setInspectorData(res.data.Noti);
                } else {
                    console.log(res.data.msg);
                }
            } else if (activeTab === 'complaints') {
                const res = await axios.get(`${serverURL}/api/getcomplaints/${userID}`);
                if (res.data.success) {
                    setComplaints(res.data.complaints);
                } else {
                    console.log(res.data.msg);
                }
            } else if (activeTab === 'suggestions') {
                const res = await axios.get(`${serverURL}/api/getsuggestions/${userID}`);
                if (res.data.success) {
                    setSuggestions(res.data.suggestions);
                } else {
                    console.log(res.data.msg);
                }
            }
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <UserNavbar />

            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
                <div className="flex border-b border-gray-300 mb-4">
                    <button
                        className={`flex-1 py-2 text-center font-semibold ${activeTab === 'inspector' ? 'bg-blue-500 text-white border-b-2 border-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('inspector')}
                    >
                        Inspector
                    </button>
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
                <div className="p-4 bg-white shadow-md rounded-lg">
                    {activeTab === 'inspector' && (
                        <div>
                            {inspectorData.length === 0 ? (
                                <p className="text-gray-600">No inspector notifications available.</p>
                            ) : (
                                inspectorData.map((data) => (
                                    <div key={data._id} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <h3 className="text-xl font-semibold text-blue-800">{data.title}</h3>
                                        <p className="text-gray-700 mt-2">{data.details}</p>
                                        {data.reply && (
                                            <div className="mt-4 p-2 border-t border-gray-300">
                                                <h4 className="font-semibold text-blue-600">Reply from Hotel:</h4>
                                                <p className="text-gray-800">{data.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'complaints' && (
                        <div>
                            {complaints.length === 0 ? (
                                <p className="text-gray-600">No complaints available.</p>
                            ) : (
                                complaints.map((comp) => (
                                    <div key={comp._id} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <h3 className="text-xl font-semibold text-blue-800">Complaint:</h3>
                                        <p className="text-gray-700 mt-2">{comp.complaint}</p>
                                        {comp.reply && (
                                            <div className="mt-4 p-2 border-t border-gray-300">
                                                <h4 className="font-semibold text-blue-600">Reply:</h4>
                                                <p className="text-gray-800">{comp.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'suggestions' && (
                        <div>
                            {suggestions.length === 0 ? (
                                <p className="text-gray-600">No suggestions available.</p>
                            ) : (
                                suggestions.map((sug) => (
                                    <div key={sug._id} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <h3 className="text-xl font-semibold text-blue-800">Suggestion:</h3>
                                        <p className="text-gray-700 mt-2">{sug.suggestion}</p>
                                        {sug.reply && (
                                            <div className="mt-4 p-2 border-t border-gray-300">
                                                <h4 className="font-semibold text-blue-600">Reply:</h4>
                                                <p className="text-gray-800">{sug.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
