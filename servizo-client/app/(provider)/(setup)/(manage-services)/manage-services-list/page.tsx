'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Services {
    _id:string;
    servicename: string;
    isActive: boolean;
}

export default function ManageServicesList() {
const router = useRouter();
const [allServices, setAllServices] = useState<Services[]>([]);

const handleAdd = () => {
  router.push('/manage-services-form');
};

const handleEdit = (serviceId: string) => {
  router.push(`/manage-services-form?edit=true&id=${serviceId}`);
};

    return (
        <div className='pt-25 pb-20'>
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold mb-4">Services List</h2>
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
                    <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {allServices.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                        No users available
                        </td>
                    </tr>
                    ) : (
                    allServices.map((service) => (
                        <tr key={service._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                            <button onClick={() => handleEdit(service._id)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                            Edit
                            </button>
                        </td>
                        <td className="py-2 px-4 border-b">{service.servicename}</td>
                        <td className="py-2 px-4 border-b">
                            {service.isActive ? <span className='active'>Active</span> : <span className='inactive'>Inactive</span>}
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