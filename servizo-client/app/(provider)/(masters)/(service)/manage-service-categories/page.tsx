'use client';

import FancyFileUpload from "@/components/shared/FileUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Category = {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
};

export default function ManageServiceCategories(){
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formSubmitError, setFormSubmitError] = useState('');

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [setFormIsActive, setFormIsActiveDetail] = useState(false);
    const [setFormCategoryName, setFormCategoryNameDetail] = useState('');
    const [setFormDescription, setFormDescriptionDetail] = useState('');
    
    useEffect(() => {  
        getAllCategories();
    }, []);

    const getAllCategories = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:3000/provider/getAllServiceCategories', {
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

    const handleAddCategoryForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');

        // Basic frontend validation
        if (
            !setFormCategoryName ||
            !setFormDescription
        ) {
            setFormSubmitError('Please fill in all required fields.');
            return;
        }
        
        const payload = {
            name: setFormCategoryName,
            description: setFormDescription,
            isActive: setFormIsActive
        };

        try {
            const response = await fetch('http://localhost:3000/provider/addNewServiceCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('New category added successfully!')
                resetForm();
                getAllCategories();
             } else {
                console.log('Something went wrong');
            }

        } catch (error) {
            console.error('Error during adding new category:', error);
        }
    }

    const handleEditCategory = (category: any) => {
        console.log(category)
        setIsEditMode(true);
        setEditingCategoryId(category._id);
        setFormIsActiveDetail(category.isActive);
        setFormCategoryNameDetail(category.name);
        setFormDescriptionDetail(category.description);
        setShowModal(true);
    }

    const handleUpdateCategoryForm = async () => {
        const token = localStorage.getItem('authToken');
        if (!editingCategoryId) return;

        const payload = {
            name: setFormCategoryName,
            description: setFormDescription,
            isActive: setFormIsActive
        };
        console.log(payload);

        try {
            const response = await fetch(`http://localhost:3000/provider/updateServiceCategory/${editingCategoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success('Category updated successfully!');
            resetForm();
            getAllCategories();
        } else {
            toast.error('Failed to update category');
        }
    } catch (error) {
        console.error('Update error:', error);
    }
    };

    const resetForm = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditingCategoryId(null);
        setFormCategoryNameDetail('');
        setFormDescriptionDetail('');
        setFormIsActiveDetail(false);
        setFormSubmitError('');
    };

    return (
        <div className='pt-25 pb-20'>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">Service Category List</h2>
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
                            <th className="py-2 px-4 border-b font-semibold text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                            No Categories available
                            </td>
                        </tr>
                        ) : (
                        categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => handleEditCategory(category)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                                Edit
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">{category.name}</td>
                            <td className="py-2 px-4 border-b">
                                {category.isActive ? <span className='active'>Active</span> : <span className='inactive'>Inactive</span>}
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
                onClick={() => {
                    setShowModal(false);
                    setFormCategoryNameDetail('');
                    setFormIsActiveDetail(false);
                    setFormDescriptionDetail('');
                    setFormSubmitError('');
                }}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
                >
                &times;
                </button>
                <h3 className="text-lg font-semibold mb-4">
                {isEditMode ? 'Edit Category' : 'Add New Category'}
                </h3>
                <form onSubmit={handleAddCategoryForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1 flex items-center gap-3">
                        <Checkbox id="terms" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                        <Label htmlFor="terms">Status</Label>
                    </div>

                    <div className="md:col-span-1"></div>

                    <div className="md:col-span-1">
                        <label htmlFor="startTime" className="block text-sm font-medium">Category Name</label>
                        <input 
                            type="text"
                            value={setFormCategoryName} 
                            onChange={(e) => setFormCategoryNameDetail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                    </div>

                    <div className="md:col-span-1"></div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium">Description</label>
                        <input
                            type="text"
                            value={setFormDescription} 
                            onChange={(e) => setFormDescriptionDetail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                </div>
                {formSubmitError && <p className="text-red-500 text-sm">{formSubmitError}</p>}
                <div className="flex justify-end mt-6">
                    <button
                    type="button"
                    onClick={() => {
                    setShowModal(false);
                    setFormCategoryNameDetail('');
                    setFormIsActiveDetail(false);
                    setFormDescriptionDetail('');
                    setFormSubmitError('');
                    }}
                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                    >
                    Cancel
                    </button>
                    {isEditMode ? (
                    <button
                        type="button"
                        onClick={handleUpdateCategoryForm}
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