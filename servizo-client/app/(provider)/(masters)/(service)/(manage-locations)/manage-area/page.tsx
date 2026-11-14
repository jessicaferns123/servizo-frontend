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

type City = {
    _id:string;
    cityname: string;
    country: Country;
    isActive: boolean;
}

interface Area {
    _id:string;
    areaname: string;
    city: City;
    country: Country;
    isActive: boolean;
}

export default function ManageArea(){
    const [isEditMode, setIsEditMode] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editingAreaId, setEditingAreaId] = useState<string | null>(null);

    const [setFormIsActive, setFormIsActiveDetail] = useState(false);
    const [setFormAreaId, setFormAreaIdDetail] = useState('');
    const [setFormAreaName, setFormAreaNameDetail] = useState('');
    const [setFormCityId, setFormCityIdDetail] = useState('');

    const [formSubmitError, setFormSubmitError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllAreas();
        getAllCities();
    }, []);

    const getAllAreas = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllAreas', {
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch areas');
            }
            const data = await response.json();
            setAreas(data['Result']);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

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

    const handleAddAreaForm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem('authToken');

        if (
            !setFormCityId ||
            !setFormAreaName
        ) {
            setFormSubmitError('Please fill in all required fields.');
            return;
        }

        const payload = {
            city: setFormCityId,
            areaname: setFormAreaName,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch('http://localhost:3000/provider/addNewArea', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('New area added successfully!')
                resetForm();
                getAllAreas();
             } else {
                console.log('Something went wrong');
            }

        } catch (error) {
            console.error('Error during adding new area:', error);
        }
    }

    const resetForm = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingAreaId(null);
        setFormCityIdDetail('');
        setFormAreaNameDetail('');
        setFormIsActiveDetail(false);
        setFormSubmitError('');
    };

    const handleEditArea = (area: any) => {
        setIsEditMode(true);
        setEditingAreaId(area._id);
        setFormCityIdDetail(area.city._id);
        setFormAreaNameDetail(area.areaname);
        setFormIsActiveDetail(area.isActive);
        setShowModal(true);
    }

    const handleUpdateAreaForm = async () => {
        const token = localStorage.getItem('authToken');

        if (!editingAreaId) return;

        const payload = {
            city: setFormCityId,
            areaname: setFormAreaName,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch(`http://localhost:3000/provider/updateArea/${editingAreaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Area updated successfully!');
                resetForm();
                getAllAreas();
            } else {
                toast.error('Failed to update area');
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    }
    
    return (
        <div>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">Area List</h2>
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
                            <th className="py-2 px-4 border-b font-semibold text-left">Area</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">City</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {areas.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                            No areas available
                            </td>
                        </tr>
                        ) : (
                        areas.map((area) => (
                            <tr key={area._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleEditArea(area)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                                    Edit
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b">{area.areaname}</td>
                                <td className="py-2 px-4 border-b">{area.city.cityname}</td>
                                <td className="py-2 px-4 border-b">
                                    {area.isActive ? <span className='active'>Active</span> : <span className='inactive'>Inactive</span>}
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
                        {isEditMode ? 'Edit Area' : 'Add New Area'}
                        </h3>
                        <form onSubmit={handleAddAreaForm}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1 flex items-center gap-3">
                                    <Checkbox id="status" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                                    <Label htmlFor="status">Status</Label>
                                </div>

                                <div className="md:col-span-1"></div>

                                <div className="md:col-span-1">
                                    <Label className='block text-sm font-medium' htmlFor="city">City</Label>
                                    <Select value={setFormCityId} onValueChange={(value) => setFormCityIdDetail(value)}>
                                        <SelectTrigger id="city" className={`w-full ${!setFormCityId && formSubmitError ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city._id} value={city._id}>{city.cityname}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="md:col-span-1">
                                    <label htmlFor="areaname" className="block text-sm font-medium">Area Name</label>
                                    <input 
                                        type="text"
                                        value={setFormAreaName} 
                                        onChange={(e) => setFormAreaNameDetail(e.target.value)}
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
                                    onClick={handleUpdateAreaForm}
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