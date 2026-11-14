'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

type Category = {
    _id: string;
    name: string;
};

type Service = {
    _id: string;
    name: string;
    priceRange: {
        min: number;
        max: number;
    };
    defaultPrice: number;
    durationRange: {
        min: number;
        max: number;
    };
    defaultDuration: number;
};

type Country = {
    _id:string;
    countryname: string;
};

type City = { 
    _id:string; 
    cityname: string;
    //countryid: number; 
};
type Area = { 
    _id:string; 
    areaname: string;
    //cityid: number; 
};

type FormDataType = {
    categoryid: string;
    serviceid: string;
    price?: number;
    duration?: number;
    countryid: string;
    cityid: string;
    areaid: string;
    isActive: boolean;
    createdAt: string;
}

export default function ManageServicesForm() {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryListData, setCategories] = useState<Category[]>([]);
    const [serviceListData, setServices] = useState<Service[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    const [setFormIsActive, setFormIsActiveDetail] = useState(false);

    const [formSubmitError, setFormSubmitError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [minDuration, setMinDuration] = useState<number>(0);
    const [maxDuration, setMaxDuration] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchCountries();
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

    const fetchServicesByCategory = async (categoryId: string) => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`http://localhost:3000/provider/getAllActiveServicesByCategory/${categoryId}`, {
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
    };

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

    const fetchCitiesByCountry = async (countryId: string) => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllCitiesByCountryId', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ countryid: countryId }),
            });
        
            if (!response.ok) throw new Error('Failed to fetch cities');
        
            const data = await response.json();
            
            setCities(data['Result']);
        } catch (err: any) {
            console.error('Error fetching cities:', err.message);
            setCities([]);
        }
    }

    const fetchAreaByCities = async (cityId: string) => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getAllAreasByCityId', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ city: cityId }),
            });
        
            if (!response.ok) throw new Error('Failed to fetch areas');
        
            const data = await response.json();
            
            setAreas(data['Result']);
        } catch (err: any) {
            console.error('Error fetching cities:', err.message);
            setAreas([]);
        }
    }

    const renderSelectField = (name: string, label: string, value: string, onValueChange: (val: string) => void, options: { id: string | number; name: string }[], placeholder: string) => (
        <div className="mb-4">
            <Label className='mb-2' htmlFor={name}>{label}</Label>
            <Select
                onValueChange={onValueChange}
                value={value}
            >
                <SelectTrigger id={name} className={cn("w-full", { "border-red-500": validationErrors[name] })}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                            {option.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {validationErrors[name] && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {validationErrors[name]}
                </p>
            )}
        </div>
    );

    const renderInputField = (name: string, label: string, type: string = "text", placeholder?: string, minValue?: number, maxValue?: number) => (
        <div className="mb-4">
            <Label className='mb-2' htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                value={(formData as any)[name] !== undefined ? (formData as any)[name] : ""}
                onChange={(e) => handleChange(e, minValue, maxValue)}
                placeholder={placeholder}
                className={cn({ "border-red-500": validationErrors[name] })}
            />
            {validationErrors[name] && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {validationErrors[name]}
                </p>
            )}
        </div>
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>,
    minValue?: number,
    maxValue?: number) => {
        const { name, value } = e.target;
        let numericValue = parseFloat(value);
        
        if (["price", "duration"].includes(name) && minValue !== undefined && maxValue !== undefined) {
            if (isNaN(numericValue) || numericValue < minValue || numericValue > maxValue) {
                setValidationErrors((prev) => ({
                    ...prev,
                    [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} must be between ${minValue} and ${maxValue}`,
                }));
            } else {
                setValidationErrors((prev) => ({ ...prev, [name]: "" }));
            }
        }

        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleServiceSelect = (service: Service) => {
        setMinPrice(service.priceRange.min);
        setMaxPrice(service.priceRange.max);
        setMinDuration(service.durationRange.min);
        setMaxDuration(service.durationRange.max);

        // Set other fields like default price if needed
        setFormData((prev) => ({
            ...prev,
            price: service.defaultPrice,
            duration: service.defaultDuration,
        }));
    };

    const [formData, setFormData] = useState<FormDataType>({
        categoryid: "",
        serviceid: "",
        isActive: false,
        createdAt: new Date().toISOString(),
        price: 0,
        duration: 0,
        countryid: "",
        cityid: "",
        areaid: "",
    })

    const formContent = [
        <>
            {renderSelectField(
                "category",
                "Category",
                formData.categoryid,
                (value) => {
                    const selectedCategory = categoryListData.find(
                        (category) => category._id === value
                    );
                    if (selectedCategory) {
                        handleSelectChange("categoryid", selectedCategory._id);
                        fetchServicesByCategory(selectedCategory._id);
                    }
                },
                categoryListData.map(c => ({ id: c._id, name: c.name })),
                "Select your category"
            )}
            {renderSelectField(
                "service",
                "Service",
                formData.serviceid,
                (value) => {
                    const selectedService = serviceListData.find(
                        (service) => service._id === value
                    );
                    if (selectedService) {
                        handleSelectChange("serviceid", selectedService._id);
                        handleServiceSelect(selectedService)
                    }
                },
                serviceListData.map(c => ({ id: c._id, name: c.name })),
                "Select your service"
            )}
            {renderInputField("price", "Price (AED)", "number", "", minPrice, maxPrice)}
            {renderInputField("duration", "Default Duration (in mins)", "number", "", minDuration, maxDuration)}
            {renderSelectField(
                "countryid",
                "Country",
                formData.countryid,
                (value) => {
                    const selectedCountry = countries.find(
                        (country) => country._id === value
                    );
                    if (selectedCountry) {
                        handleSelectChange("countryid", selectedCountry._id);
                        fetchCitiesByCountry(selectedCountry._id);
                    }
                }, 
                countries.map(c => ({ id: c._id, name: c.countryname })),
                "Select Country"
            )}
            {renderSelectField(
                "cityid",
                "City",
                formData.cityid,
                (value) => {
                    const selectedCity = cities.find(
                        (city) => city._id === value
                    );
                    if (selectedCity) {
                        handleSelectChange("cityid", selectedCity._id);
                        fetchAreaByCities(selectedCity._id);
                    }
                },
                cities.map(c => ({ id: c._id, name: c.cityname })),
                "Select your city"
            )}
        </>
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        const token = localStorage.getItem("authToken");
        e.preventDefault();
    }

    const handleUpdateUserForm = async (e: React.FormEvent) => {
        const token = localStorage.getItem("authToken");
        e.preventDefault();
    }

    return (
        <div className='pt-25 pb-20'>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">Service Form</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 flex items-center gap-3">
                        <Checkbox id="terms" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                        <Label htmlFor="terms">Status</Label>
                    </div>
                    <div className="md:col-span-1 flex items-center gap-3"></div>
                    <div className="md:col-span-1 flex items-center gap-3"></div>
                    <div className="md:col-span-1 flex items-center gap-3"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {formContent[0]}
                    </div>
                    {formSubmitError && <p className="text-red-500 text-sm">{formSubmitError}</p>}
                    <div className="flex justify-end mt-6">
                        <button
                        type="button"
                        onClick={() => {
                            router.push(`/manage-services-list`);
                        }}
                        className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                        >
                        Cancel
                        </button>
                        {isEditMode ? (
                            <button
                            type="button"
                            onClick={handleUpdateUserForm}
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
    )
}