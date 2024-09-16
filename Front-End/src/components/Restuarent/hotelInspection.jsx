import React, { useState, useEffect } from 'react';
import { Nav } from './Nav';
import axios from 'axios'

export const HotelInspection = () => {
    const [activeTab, setActiveTab] = useState('inspectionRequests');
    const [inspections, setInsp] = useState([])



    const serverUrl = 'https://safe-bite-czz1t4l2z-akhilszzs-projects.vercel.app'
    const authToken = localStorage.getItem('authTokenHotel');
    const hotelID = localStorage.getItem('hotelID');


    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.post(`${serverUrl}/api/fetchinspection`, { hotelId: hotelID }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.data.success) {
                setInsp(res.data.inspection);
                console.log(res.data.msg);

            }
            else {
                console.log(res.data.msg);
            }
        } catch (err) {
            console.log('fetching error', err);
        }
    }


    return (
        <div>
            <Nav />
            <div className="w-full ml-72 mt-20 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg max-md:ml-0 max-md: m-4 ">
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab('inspectionRequests')}
                        className={`py-2 px-4 text-sm font-medium ${activeTab === 'inspectionRequests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                        Inspection Details
                    </button>
                </div>


                <div className="mt-4">
                    {activeTab === 'inspectionRequests' && (
                        <div className="space-y-4">
                            {inspections.length > 0 ? (
                                <div className="p-4 border border-gray-200 rounded-md shadow-sm">
                                    {inspections.map(data => (
                                        <div key={data.id} className='bg-white border border-gray-200 shadow-lg rounded-lg m-1 p-6'>
                                            <p className="mb-2 text-gray-800 font-semibold">Inspection Report: {data.inspection}</p>
                                            <p className="mb-2 text-gray-800">Date: {new Date(data.date).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center">No inspection details available at the moment.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
