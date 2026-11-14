'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Country = {
    _id:string;
    countryname: string;
    countrycode: string;
    dialingcode: string;
    isActive: boolean;
};

interface City {
    _id:string;
    cityname: string;
    country: Country;
    isActive: boolean;
}

export default function ManageCity(){
    const [isEditMode, setIsEditMode] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editingCityId, setEditingCityId] = useState<string | null>(null);

    const [setFormIsActive, setFormIsActiveDetail] = useState(true);
    const [setFormCityName, setFormCityNameDetail] = useState('');
    const [setFormCountryId, setFormCountryIdDetail] = useState('');

    const [formSubmitError, setFormSubmitError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllCities();
        fetchCountries();
    }, []);

    const getAllCities = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllCities', {
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }
            const data = await response.json();
            setCities(data['Result']);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

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

    const handleAddCityForm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('authToken');

        if (
            !setFormCountryId ||
            !setFormCityName
        ) {
            setFormSubmitError('Please fill in all required fields.');
            return;
        }

        const payload = {
            country: setFormCountryId,
            cityname: setFormCityName,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch('http://localhost:3000/provider/addNewCity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('New city added successfully!')
                resetForm();
                getAllCities();
             } else {
                console.log('Something went wrong');
            }

        } catch (error) {
            console.error('Error during adding new city:', error);
        }
    }

    const resetForm = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingCityId(null);
        setFormCountryIdDetail('');
        setFormCityNameDetail('');
        setFormIsActiveDetail(false);
        setFormSubmitError('');
    };

    const handleEditCity = (city: any) => {
        setIsEditMode(true);
        setEditingCityId(city._id);
        setFormCountryIdDetail(city.country._id);
        setFormCityNameDetail(city.cityname);
        setFormIsActiveDetail(city.isActive);
        setShowModal(true);
    }

    const handleUpdateCityForm = async () => {
        const token = localStorage.getItem('authToken');

        if (!editingCityId) return;

        const payload = {
            countryid: setFormCountryId,
            cityname: setFormCityName,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch(`http://localhost:3000/provider/updateCity/${editingCityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('City updated successfully!');
                resetForm();
                getAllCities();
            } else {
                toast.error('Failed to update city');
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    }
    
    return (
        <div>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">City List</h2>
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
                            <th className="py-2 px-4 border-b font-semibold text-left">City</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Country</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                            No cities available
                            </td>
                        </tr>
                        ) : (
                        cities.map((city) => (
                            <tr key={city._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleEditCity(city)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                                    Edit
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b">{city.cityname}</td>
                                <td className="py-2 px-4 border-b">{city.country.countryname}</td>
                                <td className="py-2 px-4 border-b">
                                    {city.isActive ? <span className='active'>Active</span> : <span className='inactive'>Inactive</span>}
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
                        {isEditMode ? 'Edit City' : 'Add New City'}
                        </h3>
                        <form onSubmit={handleAddCityForm}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1 flex items-center gap-3">
                                    <Checkbox id="status" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                                    <Label htmlFor="status">Status</Label>
                                </div>

                                <div className="md:col-span-1"></div>

                                <div className="md:col-span-1">
                                    <Label className='block text-sm font-medium' htmlFor="country">Country</Label>
                                    <Select value={setFormCountryId} onValueChange={(value) => setFormCountryIdDetail(value)}>
                                        <SelectTrigger id="country" className={`w-full ${!setFormCountryId && formSubmitError ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country._id} value={country._id}>{country.countryname}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="md:col-span-1">
                                    <label htmlFor="cityname" className="block text-sm font-medium">City Name</label>
                                    <input 
                                        type="text"
                                        value={setFormCityName} 
                                        onChange={(e) => setFormCityNameDetail(e.target.value)}
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
                                    onClick={handleUpdateCityForm}
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