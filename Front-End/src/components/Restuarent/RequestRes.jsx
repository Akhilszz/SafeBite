import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Nav } from './Nav';

export const RequestRes = () => {
    const [activeTab, setActiveTab] = useState('Approval');
    const [hotel, setHotel] = useState([]);
    const [documentLink, setDocumentLink] = useState(''); // Use state for document link
    const serverURL = 'https://safe-bite.vercel.app';
    const Email = localStorage.getItem('hotelEmail');
    const hotelId = localStorage.getItem('hotelID');

    useEffect(() => {
        fetchHotel();
    }, []);

    async function fetchHotel() {
        try {
            const res = await axios.post(`${serverURL}/api/fetchhotel`, { email: Email });
            if (res.data.success) {
                setHotel(res.data.hotel);
            }
        } catch (err) {
            console.error('Error fetching hotel:', err);
        }
    }

    async function handleRequest(id) {
        try {
            const res = await axios.post(`${serverURL}/api/request/${id}`, { request: 'request' });
            if (res.data.success) {
                alert('Request submitted');
                fetchHotel();
            }
        } catch (err) {
            console.error('Error submitting request:', err);
        }
    }

    async function handleDocumentLinkUpload() {
        if (!documentLink) {
            alert('Please provide a document link.');
            return;
        }

        try {
            const response = await axios.post(`${serverURL}/api/documentupload/${hotelId}`, {
                document: documentLink, // Sending the document link as a string
            });

            console.log('Document link uploaded successfully:', response.data);
            alert('Document link uploaded successfully.');
            fetchHotel(); // Refresh hotel data after successful upload
        } catch (error) {
            console.error('Error uploading document link:', error);
            alert('Error uploading document link. Please try again.');
        }
    }

    const renderMilestone = (status) => {
        const milestones = ['uploaded', 'verified', 'approved', 'generated'];
        const currentMilestoneIndex = milestones.indexOf(status);

        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Document Status</h3>
                <div className="flex items-center space-x-4">
                    {milestones.map((milestone, index) => (
                        <div key={milestone} className="flex items-center">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${index <= currentMilestoneIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                            >
                                {index + 1}
                            </div>
                            <span className={`ml-2 ${index <= currentMilestoneIndex ? 'font-semibold' : 'text-gray-600'}`}>
                                {milestone.charAt(0).toUpperCase() + milestone.slice(1)}
                            </span>
                            {index < milestones.length - 1 && <div className="h-1 w-8 bg-gray-300"></div>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <Nav />
            <div className="bg-white md:ml-64 mt-20 md:mr-8 shadow-md rounded-lg max-md:ml-4 p-4">
                <div className="flex border-b border-gray-200 max-md:flex-col">
                    <button
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'Approval' ? 'bg-blue-500 text-white' : 'text-blue-500'} border-b-2 border-transparent hover:border-blue-500`}
                        onClick={() => setActiveTab('Approval')}
                    >
                        Request
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'License' ? 'bg-blue-500 text-white' : 'text-blue-500'} border-b-2 border-transparent hover:border-blue-500`}
                        onClick={() => setActiveTab('License')}
                    >
                        License & Grade
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'Approval' && hotel.map(data => (
                        <div key={data._id}>
                            {data.request === 'none' ? (
                                <p className="flex flex-col sm:flex-row items-center justify-between">
                                    Request for Hotel Registration
                                    <button
                                        onClick={() => handleRequest(data._id)}
                                        className="bg-blue-500 text-white py-1 px-2 mt-2 sm:mt-0 sm:ml-2 rounded hover:bg-blue-600"
                                    >
                                        Request
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    {data.request === 'request' ? 'Your request is processing' : 'Your hotel registration request is approved by Admin.'}
                                </p>
                            )}
                        </div>
                    ))}

                    {activeTab === 'License' && hotel.map(data => (
                        <div key={data._id}>
                            {data.request === 'request' || data.request === 'none' ? (
                                <p>You are not registered to apply for a license</p>
                            ) : (
                                <div>
                                    {data.liceno && data.liceno.length !== 0 && data.rating && data.rating !== '' ? (
                                        <p>Your license and grade have already been issued</p>
                                    ) : (
                                        <div>
                                            {renderMilestone(data.status)}
                                            {data.status !== 'generated' && (
                                                <div>
                                                    <h2 className="text-lg font-semibold mb-4">Upload Required Documents</h2>
                                                    <p className="mb-4">
                                                        Please upload the following documents as a single link required for obtaining a hotel license & grade:
                                                    </p>
                                                    <ul className="list-disc pl-5 mb-4 text-sm">
                                                        <li>Certificate of Incorporation</li>
                                                        <li>Partnership Deed or Memorandum of Association</li>
                                                        <li>Property Ownership Proof</li>
                                                        <li>Property Use Certificate</li>
                                                        <li>Health and Safety Inspection Report</li>
                                                        <li>Fire Safety Certificate</li>
                                                        <li>Public Liability Insurance</li>
                                                        <li>Property Insurance</li>
                                                        <li>Environmental Impact Assessment</li>
                                                        <li>Food Service License</li>
                                                        <li>Liquor License</li>
                                                        <li>Tax Identification Number</li>
                                                        <li>Employment Contracts</li>
                                                        <li>Labor Compliance Certificates</li>
                                                    </ul>
                                                    <input
                                                        type="text"
                                                        onChange={(e) => setDocumentLink(e.target.value)} // Set document link
                                                        className="block w-full mb-4 border border-gray-300 rounded-md shadow-sm p-2"
                                                        required
                                                        placeholder='Document link (e.g., Google Drive or Dropbox link)'
                                                    />

                                                    <button
                                                        onClick={handleDocumentLinkUpload} // Trigger document link upload
                                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full sm:w-auto"
                                                    >
                                                        Upload Document Link
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
