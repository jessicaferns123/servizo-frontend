'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

interface Users {
  _id:string;
  fullname: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function ManageUsersList() {
const router = useRouter();
const [allUsers, setAllUsers] = useState<Users[]>([]);

const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchUsersList();
}, []);

const fetchUsersList = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('http://localhost:3000/provider/getAllUsers', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch user claims');

    const data = await response.json();
    
    setAllUsers(data['Result']);
  } catch (err: any) {
    setError(err.message);
  }
};

const handleAdd = () => {
  router.push('/manage-users-tab');
};

const handleEdit = (userId: string) => {
  router.push(`/manage-users-tab?edit=true&id=${userId}`);
};

 return (
    <div className='pt-25 pb-20'>
      <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4">Users List</h2>
            <button type="button"
              className="bg-[#F15A29] hover:bg-[#d94c1f] text-white py-2 px-4 rounded-md cursor-pointer text-sm"
              onClick={handleAdd}
            >
              Add New
            </button>
          </div>
            
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 h-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b font-semibold text-left">Action</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Name</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Username</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Role Name</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No users available
                    </td>
                  </tr>
                ) : (
                  allUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => handleEdit(user._id)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                        Edit
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">{user.fullname}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        {user.isActive ? <span className='active'>Active</span> : <span className='inactive'>Inactive</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
  
}