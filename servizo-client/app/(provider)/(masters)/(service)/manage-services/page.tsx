'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { durationOptions } from "@/lib/constants";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Category = {
    _id: string;
    name: string;
    description: string;
};

type Service = {
    _id: string;
    name: string;
    description: string;
    category: Category;
    isActive: boolean;
};

export default function ManageServices(){
    const [showModal, setShowModal] = useState(false);
    
    const [categoryListData, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    const [formSubmitError, setFormSubmitError] = useState('');

    const [setFormIsActive, setFormIsActiveDetail] = useState(false);
    const [setFormServiceName, setFormServiceNameDetail] = useState('');
    const [setFormDescription, setFormDescriptionDetail] = useState('');
    const [setCategory, setCategoryDetail] = useState<any>(null);
    const [defaultPrice, setDefaultPrice] = useState<number>(0);
    const [priceRangeMin, setPriceRangeMin] = useState<number>(0);
    const [priceRangeMax, setPriceRangeMax] = useState<number>(0);
    const [defaultDuration, setDefaultDuration] = useState<string>('');
    const [durationRangeMin, setDurationRangeMin] = useState<string>('');
    const [durationRangeMax, setDurationRangeMax] = useState<string>('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllServices();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllActiveServiceCategories', {
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data['Result']);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getAllServices = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllServices', {
                method: 'GET', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }
            const data = await response.json();
            setServices(data['Result']);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleAddServiceForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');

        if (
            !setFormServiceName ||
            !setCategory ||
            !defaultPrice ||
            !priceRangeMin ||
            !priceRangeMax ||
            !defaultDuration ||
            !durationRangeMin ||
            !durationRangeMax
        ) {
            setFormSubmitError('Please fill in all required fields.');
            return;
        }

        const payload = {
            name: setFormServiceName,
            description: setFormDescription,
            categoryid: setCategory,
            defaultPrice: defaultPrice,
            priceRangeMin: priceRangeMin,
            priceRangeMax: priceRangeMax,
            defaultDuration: defaultDuration,
            durationRangeMin: durationRangeMin,
            durationRangeMax: durationRangeMax,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch('http://localhost:3000/provider/addNewService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('New service added successfully!')
                resetForm();
                getAllServices();
             } else {
                console.log('Something went wrong');
            }

        } catch (error) {
            console.error('Error during adding new service:', error);
        }
    }

    const handleUpdateServiceForm = async () => {
        const token = localStorage.getItem('authToken');

        if (!editingServiceId) return;

        const payload = {
            name: setFormServiceName,
            description: setFormDescription,
            categoryid: setCategory,
            defaultPrice: defaultPrice,
            priceRangeMin: priceRangeMin,
            priceRangeMax: priceRangeMax,
            defaultDuration: defaultDuration,
            durationRangeMin: durationRangeMin,
            durationRangeMax: durationRangeMax,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch(`http://localhost:3000/provider/updateService/${editingServiceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success('Service updated successfully!');
            resetForm();
            getAllServices();
        } else {
            toast.error('Failed to update service');
        }
        } catch (error) {
            console.error('Update error:', error);
        }
    }

    const handleEditService = (service: any) => {
        setIsEditMode(true);
        setEditingServiceId(service._id);
        setFormIsActiveDetail(service.isActive);
        setFormServiceNameDetail(service.name);
        setFormDescriptionDetail(service.description);
        setCategoryDetail(service.category._id);
        setDefaultPrice(service.defaultPrice);
        setPriceRangeMin(service.priceRange.min);
        setPriceRangeMax(service.priceRange.max);
        setDefaultDuration(service.defaultDuration.toString());
        setDurationRangeMin(service.durationRange.min.toString());
        setDurationRangeMax(service.durationRange.max.toString());
        setShowModal(true);
    }

    const resetForm = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingServiceId(null);
        setFormServiceNameDetail('');
        setFormDescriptionDetail('');
        setFormIsActiveDetail(false);
        setCategoryDetail(null);
        setDefaultPrice(0);
        setPriceRangeMin(0);
        setPriceRangeMax(0);
        setDefaultDuration('');
        setDurationRangeMin('');
        setDurationRangeMax('');
        setFormSubmitError('');
    };

    return (
        <div className='pt-25 pb-20'>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">Service List</h2>
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
                            <th className="py-2 px-4 border-b font-semibold text-left">Name</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Category</th>
                            <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                            No services available
                            </td>
                        </tr>
                        ) : (
                        services.map((service) => (
                            <tr key={service._id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => handleEditService(service)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                                Edit
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">{service.name}</td>
                            <td className="py-2 px-4 border-b">{service.category.name}</td>
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
                    {isEditMode ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <form onSubmit={handleAddServiceForm}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 flex items-center gap-3">
                            <Checkbox id="status" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                            <Label htmlFor="status">Status</Label>
                        </div>

                        <div className="md:col-span-1"></div>
                        <div className="md:col-span-1"></div>

                        <div className="md:col-span-1">
                            <Label className='block text-sm font-medium' htmlFor="category">Category</Label>
                            <Select value={setCategory} onValueChange={(value) => setCategoryDetail(value)}>
                                <SelectTrigger id="category" className={`w-full ${!setCategory && formSubmitError ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryListData.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2">
                            <Label className='block text-sm font-medium' htmlFor="servicename">Service Name</Label>
                            <Input 
                                type="text"
                                value={setFormServiceName} 
                                onChange={(e) => setFormServiceNameDetail(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <Label htmlFor="description" className="block text-sm font-medium">Service Description</Label>
                            <Input
                                type="text"
                                value={setFormDescription} 
                                onChange={(e) => setFormDescriptionDetail(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Label className="block text-sm font-medium">Default Price (AED)</Label>
                            <Input
                            type="number"
                            value={defaultPrice}
                            onChange={(e) => setDefaultPrice(Number(e.target.value))}
                            className="w-full"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Label className="block text-sm font-medium">Min Price (AED)</Label>
                            <Input
                            type="number"
                            value={priceRangeMin}
                            onChange={(e) => setPriceRangeMin(Number(e.target.value))}
                            className="w-full"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Label className="block text-sm font-medium">Max Price (AED)</Label>
                            <Input
                            type="number"
                            value={priceRangeMax}
                            onChange={(e) => setPriceRangeMax(Number(e.target.value))}
                            className="w-full"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Label className="block text-sm font-medium">Default Duration</Label>
                            <Select value={defaultDuration} onValueChange={setDefaultDuration}>
                                <SelectTrigger id="defaultDuration" className={`w-full ${!defaultDuration && formSubmitError ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select Default Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationOptions.map((dur) => (
                                        <SelectItem key={dur} value={dur.toString()}>{dur} minutes</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-1">
                            <Label className="block text-sm font-medium">Minimum Duration</Label>
                            <Select value={durationRangeMin} onValueChange={setDurationRangeMin}>
                                <SelectTrigger id="minDuration" className={`w-full ${!durationRangeMin && formSubmitError ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select Minimum Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationOptions.map((dur) => (
                                        <SelectItem key={dur} value={dur.toString()}>{dur} minutes</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-1">
                            <Label className="block text-sm font-medium">Maximum Duration</Label>
                            <Select value={durationRangeMax} onValueChange={setDurationRangeMax}>
                                <SelectTrigger id="maxDuration" className={`w-full ${!durationRangeMax && formSubmitError ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select Maximum Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationOptions.map((dur) => (
                                        <SelectItem key={dur} value={dur.toString()}>{dur} minutes</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            onClick={handleUpdateServiceForm}
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