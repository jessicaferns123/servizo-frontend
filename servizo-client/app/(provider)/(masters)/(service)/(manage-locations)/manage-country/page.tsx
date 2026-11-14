'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Country {
    _id:string;
    countryname: string;
    countrycode: string;
    dialingcode: string;
    isActive: boolean;
}

export default function ManageCountry(){
    const [isEditMode, setIsEditMode] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editingCountryId, setEditingCountryId] = useState<string | null>(null);

    const [setFormIsActive, setFormIsActiveDetail] = useState(true);
    const [setFormCountryName, setFormCountryNameDetail] = useState('');
    const [setFormCountryCode, setFormCountryCodeDetail] = useState('');
    const [setFormDialingCode, setFormDialingCodeDetail] = useState('');

    const [formSubmitError, setFormSubmitError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllCountries', {
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            }); 
            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }
            const data = await response.json();

            setCountries(data['Result']);
        } catch (err:any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleAddCountryForm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('authToken');

        if (
            !setFormCountryName ||
            !setFormCountryCode ||
            !setFormDialingCode
        ) {
            setFormSubmitError('Please fill in all required fields.');
            return;
        }

        const payload = {
            countryname: setFormCountryName,
            countrycode: setFormCountryCode,
            dialingcode: setFormDialingCode,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch('http://localhost:3000/provider/addNewCountry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('New country added successfully!')
                resetForm();
                fetchCountries();
             } else {
                console.log('Something went wrong');
            }

        } catch (error) {
            console.error('Error during adding new country:', error);
        }
    }

    const resetForm = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingCountryId(null);
        setFormCountryNameDetail('');
        setFormIsActiveDetail(false);
        setFormCountryCodeDetail('');
        setFormDialingCodeDetail('');
        setFormSubmitError('');
    };

    const handleEditCountry = (country: any) => {
        setIsEditMode(true);
        setEditingCountryId(country._id);
        setFormCountryNameDetail(country.countryname);
        setFormCountryCodeDetail(country.countrycode);
        setFormDialingCodeDetail(country.dialingcode);
        setFormIsActiveDetail(country.isActive);
        setShowModal(true);
    }

    const handleUpdateCountryForm = async () => {
        const token = localStorage.getItem('authToken');

        if (!editingCountryId) return;

        const payload = {
            countryname: setFormCountryName,
            countrycode: setFormCountryCode,
            dialingcode: setFormDialingCode,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch(`http://localhost:3000/provider/updateCountry/${editingCountryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Country updated successfully!');
                resetForm();
                fetchCountries();
            } else {
                toast.error('Failed to update country');
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    }
    
    return (
        <div>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">Country List</h2>
                    <button type="button"
                    className="bg-[#F15A29] hover:bg-[#d94c1f] text-white py-2 px-4 rounded-md cursor-pointer text-sm"
                    onClick={() => setShowModal(true)}
                    >
                    Add New
                    </button>
                </div>
                    
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200 h-full">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b font-semibold text-left">Action</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Country</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Country Code</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Dialing Code</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countries.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                            No countries available
                            </td>
                        </tr>
                        ) : (
                        countries.map((country) => (
                            <tr key={country._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleEditCountry(country)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                                    Edit
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b">{country.countryname}</td>
                                <td className="py-2 px-4 border-b">{country.countrycode}</td>
                                <td className="py-2 px-4 border-b">{country.dialingcode}</td>
                                <td className="py-2 px-4 border-b">
                                    {country.isActive ? <span className='active'>Active</span> : <span className='inactive'>Inactive</span>}
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL POPUP */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative">
                        <button
                        onClick={resetForm}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
                        >
                        &times;
                        </button>
                        <h3 className="text-lg font-semibold mb-4">
                        {isEditMode ? 'Edit Country' : 'Add New Country'}
                        </h3>
                        <form onSubmit={handleAddCountryForm}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1 flex items-center gap-3">
                                    <Checkbox id="status" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                                    <Label htmlFor="status">Status</Label>
                                </div>

                                <div className="md:col-span-1"></div>

                                <div className="md:col-span-1">
                                    <label htmlFor="countryname" className="block text-sm font-medium">Country Name</label>
                                    <input 
                                        type="text"
                                        value={setFormCountryName} 
                                        onChange={(e) => setFormCountryNameDetail(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                        />
                                </div>

                                <div className="md:col-span-1">
                                    <label htmlFor="countrycode" className="block text-sm font-medium">Country Code</label>
                                    <input
                                        type="text"
                                        value={setFormCountryCode} 
                                        onChange={(e) => setFormCountryCodeDetail(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label htmlFor="dialingcode" className="block text-sm font-medium">Dialing Code</label>
                                    <input
                                        type="text"
                                        value={setFormDialingCode} 
                                        onChange={(e) => setFormDialingCodeDetail(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                    />
                                </div>
                            </div>
                            {formSubmitError && <p className="text-red-500 text-sm">{formSubmitError}</p>}
                            <div className="flex justify-end mt-6">
                                <button
                                type="button"
                                onClick={resetForm}
                                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                                >
                                Cancel
                                </button>
                                {isEditMode ? (
                                <button
                                    type="button"
                                    onClick={handleUpdateCountryForm}
                                    className="px-4 py-2 bg-[#F15A29] text-white rounded hover:bg-[#d94c1f] cursor-pointer"
                                >
                                    Update
                                </button>
                                ) : (
                                <button
                                type="submit"
                                className="px-4 py-2 bg-[#F15A29] text-white rounded hover:bg-[#d94c1f] cursor-pointer"
                                >
                                Save
                                </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    )
}