'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  createdAt: Date;
  fullname: string;
  email: string;
  countryname: string;
  cityname: string;
  status: string;
}

export default function ApprovalsList() {
    const router = useRouter();
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchPendingUserRequests = async () => {
            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch('http://localhost:3000/provider/pending-users', {
                    method: 'GET', 
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch user approval requests');

                const data = await response.json();

                setPendingUsers(data['Result']);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchPendingUserRequests();
    }, []);

    const handleViewRequest = (userId: string) => {
        router.push(`/approvals-form?id=${userId}`);
    };

    return (
        <div className='pt-25 pb-20'>
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold mb-4">Approvals List</h2>
            </div>
                
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 h-full">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b font-semibold text-left">Action</th>
                        <th className="py-2 px-4 border-b font-semibold text-left">Request Date</th>
                        <th className="py-2 px-4 border-b font-semibold text-left">Name</th>
                        <th className="py-2 px-4 border-b font-semibold text-left">Email</th>
                        <th className="py-2 px-4 border-b font-semibold text-left">Country</th>
                        <th className="py-2 px-4 border-b font-semibold text-left">City</th>
                        <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                        No users available
                        </td>
                    </tr>
                    ) : (
                    pendingUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                            <button onClick={() => handleViewRequest(user._id)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                            View
                            </button>
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}</td>
                        <td className="py-2 px-4 border-b">{user.fullname}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.countryname}</td>
                        <td className="py-2 px-4 border-b">{user.cityname}</td>
                        <td className="py-2 px-4 border-b pending">{user.status}</td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
        </div>
        </div>
    )
}