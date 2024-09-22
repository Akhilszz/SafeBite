import { useEffect, useState } from 'react';
import { Navigation } from "./Navigation";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Action = () => {
    const [activeTab, setActiveTab] = useState('Permission');
    const [innerTab, setInnerTab] = useState('Requested');
    const [permissionText, setPermissionText] = useState('');
    const [title, setTitle] = useState('');
    const [fileLink, setFileLink] = useState('');
    const [officers, setOfficers] = useState([]);
    const [permissionError, setPermissionError] = useState('');
    const [reportError, setReportError] = useState('');

    const serverUrl = 'https://safe-bite.vercel.app';
    const officerID = localStorage.getItem('officerID');

    const nav = useNavigate();

    useEffect(() => {
        GetOfficers();
    }, []);

    async function GetOfficers() {
        try {
            const response = await axios.get(`${serverUrl}/api/getofficer`);
            if (response.data.success) {
                setOfficers(response.data.officers.filter(data => data._id === officerID));
            }
            console.log(response.data.msg);
        } catch (err) {
            console.log('fetch error', err);
        }
    }

    const handlePermissionSubmit = async () => {
        setPermissionError('');

        if (!title || !permissionText) {
            setPermissionError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post(`${serverUrl}/api/permission`, {
                officerId: officerID,
                title: title,
                details: permissionText,
                status: 'requested'
            });

            if (response.data.success) {
                alert(response.data.msg);
                setPermissionText('');
                setTitle('');
                GetOfficers();
            } else {
                setPermissionError(response.data.msg || 'Permission request failed.');
            }
        } catch (err) {
            console.log('permission error', err);
            setPermissionError('An error occurred while submitting the permission request.');
        }
    };

    const handleReportSubmit = async () => {
        setReportError('');

        if (!fileLink) {
            setReportError('Please enter a file link.');
            return;
        }

        try {
            const response = await axios.post(`${serverUrl}/api/report/${officerID}`, {
                document: fileLink
            });

            console.log('File link submitted successfully:', response.data);
            alert('File link submitted successfully.');
            setFileLink('');
            nav('/action');
        } catch (error) {
            console.error('Error submitting file link:', error);
            setReportError('Error submitting file link. Please try again.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Navigation />

            <div className="p-6 mt-12 ml-72 max-md:ml-0">
                <div className="flex border-b border-gray-300">
                    {['Permission', 'ReportSubmission', 'Request'].map(tab => (
                        <button
                            key={tab}
                            className={`py-2 px-6 text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                    {activeTab === 'Permission' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Permission Request</h2>
                            {permissionError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-300 rounded-md">
                                    {permissionError}
                                </div>
                            )}
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded mb-4"
                                placeholder="Enter title"
                                value={title}
                                required
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded mb-4"
                                placeholder="Explain the permission you need..."
                                value={permissionText}
                                required
                                onChange={(e) => setPermissionText(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                                onClick={handlePermissionSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {activeTab === 'ReportSubmission' && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Submit a Report</h2>
                            {reportError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-300 rounded-md">
                                    {reportError}
                                </div>
                            )}
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded mb-4"
                                placeholder="Enter file link"
                                value={fileLink}
                                onChange={(e) => setFileLink(e.target.value)}
                                required
                            />
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                                onClick={handleReportSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {activeTab === 'Request' && (
                        <div>
                            <div className="flex border-b border-gray-300 mb-4">
                                {['Requested', 'Granted'].map(status => (
                                    <button
                                        key={status}
                                        className={`py-2 px-6 text-sm font-semibold transition-colors ${innerTab === status ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                                        onClick={() => setInnerTab(status)}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            {officers.length > 0 ? (
                                officers.map(officer => (
                                    <div key={officer._id} className="border border-gray-200 p-4 rounded-lg mb-4 shadow-sm">
                                        {officer.permission
                                            .filter(data => data.status.toLowerCase() === innerTab.toLowerCase())
                                            .map(data => (
                                                <div key={data._id} className="mb-2">
                                                    <p className="text-sm"><strong>Title:</strong> {data.title}</p>
                                                    <p className="text-sm"><strong>Details:</strong> {data.details}</p>
                                                    <p className="text-sm"><strong>Status:</strong> {data.status}</p>
                                                    <p className="text-sm"><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                    </div>
                                ))
                            ) : (
                                <p>No requests found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
