'use client';

import FancyFileUpload from "@/components/shared/FileUpload";
import { MultiSelectField } from "@/components/shared/MultiSelectField";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaExclamationCircle } from "react-icons/fa";

type ProviderDetails = {
    fullname: string;
    profileImage?:string;
    createdAt: Date,
    email?: string;
    mobilenumber?:string;
    experience?:string;
    username?:string;
    gender?:string;
    nationalityid?:string,
    nationalityname?:string,
    countryid?:string,
    countryname?:string,
    cityid?:string,
    cityname?:string,
    streetaddress?:string,
    landmark?:string,
    postalcode?:string,
    preferredlanguage?:string[],
}

type Gender = {
  genderid: string;
  gendername: string;
};

type Country = {
    countryid: number;
    countryname: string;
    countrycode: string;
    dialingcode: string;
    isActive: boolean;
};

type City = {
    cityid: number;
    cityname: string;
    isActive: boolean;
};

export default function ProviderProfile(){
    const [providerDetails, setproviderDetails] = useState<ProviderDetails | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState<{
    fullname: string;
    email: string;
    mobilenumber: string;
    experience: string;
    username: string;
    gender: string;
    nationalityid: string;
    nationalityname: string;
    countryid: string;
    countryname: string;
    cityid: string;
    cityname: string;
    streetaddress: string,
    landmark: string,
    postalcode: string,
    preferredlanguage: string[],
    profileImage: File | string | null;
}>({
        fullname: "",
        email: "",
        mobilenumber: "",
        experience: "",
        username: "",
        gender: "",
        nationalityid: "",
        nationalityname: "",
        countryid: "",
        countryname: "",
        cityid: "",
        cityname: "",
        streetaddress: "",
        landmark: "",
        postalcode: "",
        preferredlanguage: [],
        profileImage: null,
    })

    useEffect(() => {
        fetchCountries();
        getProviderDetails();
    },[]);

    const fetchCountries = async () => {
        try {
            const response = await fetch('http://localhost:3000/global/getAllCountries'); 
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
    };

    const fetchCitiesByCountry = async (countryId: number) => {
        try {
            const response = await fetch('http://localhost:3000/global/getAllCitiesByCountryId', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
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
    };

    const getProviderDetails = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:3000/provider/getProviderDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }); 

            if (!response.ok) {
                throw new Error('Failed to fetch provider details');
            }

            const data = await response.json();
            console.log(data);
            setproviderDetails(data['Result']);
            setFormData(data['Result']);
            setEditingUserId(data['Result']._id)

            fetchCitiesByCountry(Number(formData.countryid));
        } catch (err:any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [genderListData, setGenderListData] = useState<Gender[]>([
        {
            genderid: "male",
            gendername: "Male"
        },
        {
            genderid: "female",
            gendername: "Female",
        }
    ])

    const languageOptions = [
        { value: 'english', label: 'English' },
        { value: 'arabic', label: 'Arabic' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for the field when user starts typing
        if (validationErrors[e.target.name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for the field when user selects
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (files: File[] | null, type: string) => {
        if (files && files.length > 0) {
            setFormData((prev) => ({ ...prev, [type]: files[0] }));
            // Clear error for the file input
            if (validationErrors[type]) {
                setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[type];
                    return newErrors;
                });
            }
        } else {
            setFormData((prev) => ({ ...prev, [type]: null }));
        }
    };

    const renderInputField = (name: string, label: string, type: string = "text", isreadonly: boolean, placeholder?: string) => (
      <div className="mb-4">
          <Label className='mb-2' htmlFor={name}>{label}</Label>
          <Input
              id={name}
              name={name}
              type={type}
              value={(formData as any)[name]}
              onChange={handleChange}
              placeholder={placeholder}
              readOnly={isreadonly}
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

    const renderSelectField = (name: string, label: string, value: string, isreadonly: boolean, onValueChange: (val: string) => void, options: { id: string | number; name: string }[], placeholder: string) => (
        <div className="mb-4">
            <Label className='mb-2' htmlFor={name}>{label}</Label>
            <Select
                onValueChange={onValueChange}
                value={value}
            >
                <SelectTrigger id={name} className={cn("w-full", { "border-red-500": validationErrors[name] })} disabled={isreadonly}>
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

    const renderMultiSelectField = (name: string, label: string, value: string[], isreadonly: boolean, onValueChange: (val: string[]) => void, options: { value: string; label: string }[], placeholder: string) => (
        <div className="mb-4">
            <MultiSelectField
            label={label}
            name={name}
            selectedValues={value}
            onChange={onValueChange}
            options={options} 
            placeholder={placeholder}
            disabled={isreadonly}
            error={validationErrors[name]}
            />
        </div>
    );

    const formContent = [
        <>
            {renderInputField("username", "Username", "text", !isEditMode, "")}
            {renderInputField("fullname", "Full Name", "text", !isEditMode, "John Doe")}
            {renderInputField("mobilenumber", "Mobile Number", "text", !isEditMode, "5xxxxxxxx")}
            {renderInputField("email", "Email", "text", !isEditMode, "test@example.com")}
            {renderSelectField(
                "gender",
                "Gender",
                formData.gender,
                !isEditMode,
                (value) => {
                    const selectedGender = genderListData.find(
                        (gen) => gen.genderid === value
                    );
                    if (selectedGender) {
                        handleSelectChange("gender", selectedGender.genderid);
                    }
                },
                genderListData.map(c => ({ id: c.genderid, name: c.gendername })),
                "Select your gender"
            )}
            {renderSelectField(
                "nationalityid",
                "Nationality",
                formData.nationalityid,
                !isEditMode,
                (value) => {
                    const selectedNationality = countries.find(
                        (nation) => nation.countryid === Number(value)
                    );
                    if (selectedNationality) {
                        handleSelectChange("nationalityid", selectedNationality.countryid.toString());
                        handleSelectChange("nationalityname", selectedNationality.countryname);
                    }
                },
                countries.map(c => ({ id: c.countryid, name: c.countryname })),
                "Select your Nationality"
            )}
            {renderInputField("experience", "Experience", "text", !isEditMode, "")}
            {renderSelectField(
                "countryid",
                "Country",
                formData.countryid,
                !isEditMode,
                (value) => {
                    const selectedCountry = countries.find(
                        (country) => country.countryid === Number(value)
                    );
                    if (selectedCountry) {
                        handleSelectChange("countryid", selectedCountry.countryid.toString());
                        handleSelectChange("countryname", selectedCountry.countryname);
                        fetchCitiesByCountry(selectedCountry.countryid);
                        handleSelectChange("cityid", ""); // Reset city when country changes
                        handleSelectChange("cityname", ""); // Reset city name when country changes
                    }
                },
                countries.map(c => ({ id: c.countryid, name: c.countryname })),
                "Select your country"
            )}
            {renderSelectField(
                "cityid",
                "City",
                formData.cityid,
                !isEditMode,
                (value) => {
                    const selectedCity = cities.find(
                        (city) => city.cityid === Number(value)
                    );
                    if (selectedCity) {
                        handleSelectChange("cityid", selectedCity.cityid.toString());
                        handleSelectChange("cityname", selectedCity.cityname);
                    }
                },
                cities.map(c => ({ id: c.cityid, name: c.cityname })),
                "Select your city"
            )}
            {renderInputField("streetaddress", "Street Address", "text", !isEditMode, "")}
            {renderInputField("landmark", "Landmark", "text", !isEditMode, "")}
            {renderInputField("postalcode", "Postal Code", "text", !isEditMode, "")}
            {renderMultiSelectField("preferredlanguage", "Preferred Language", formData.preferredlanguage, !isEditMode, (vals) => setFormData({ ...formData, preferredlanguage: vals }), languageOptions, "Select languages")}
        </>
    ]

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (providerDetails) {
            setFormData({
                fullname: providerDetails.fullname || "",
                email: providerDetails.email || "",
                mobilenumber: providerDetails.mobilenumber || "",
                username: providerDetails.username || "",
                experience: providerDetails.experience || "",
                gender: providerDetails.gender || "",
                nationalityid: providerDetails.nationalityid || "",
                nationalityname: providerDetails.nationalityname || "", 
                countryid: providerDetails.countryid || "",
                countryname: providerDetails.countryname || "", 
                cityid: providerDetails.cityid || "",
                cityname: providerDetails.cityname || "", 
                streetaddress: providerDetails.streetaddress || "",
                landmark: providerDetails.landmark || "",
                postalcode: providerDetails.postalcode || "",
                preferredlanguage: providerDetails.preferredlanguage || [], 
                profileImage: providerDetails.profileImage || null, 
            });
        }
    }

    const handleUpdateUserProfileForm = async (e: React.FormEvent) => {
        const token = localStorage.getItem("authToken");
        e.preventDefault();
        if (!editingUserId) return;

        try {
            console.log(formData)

            const response = await fetch(`http://localhost:3000/provider/updateUser/${editingUserId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Profile updated successfully")
                setIsEditMode(false);
            } else {
                toast.error('Something went wrong');
            }   
        } catch (error) {
            console.error('Error :', error);
        }
    }
    
    if (!providerDetails) return <div className="text-center py-10">Loading profile...</div>;

    return(
        <>
            <div className="max-w-7xl mx-auto px-6 py-12 my-10">
                {/* Header Section */}
                <Card>
                    <CardContent className="p-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={providerDetails?.profileImage || "/profile_placeholder.png"} alt={providerDetails?.fullname || "Provider"} />
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-semibold">{providerDetails.fullname}</h2>
                                <p className="text-xs text-gray-400 mb-1">{providerDetails.email}</p>
                                <p className="text-sm text-gray-600 mb-1">{providerDetails.cityname}, {providerDetails.countryname}</p>
                                <span className="text-sm text-emerald-800 bg-green-200 px-2 py-1 rounded-lg">Active</span>
                            </div>
                        </div>
                        {isEditMode ? (
                            <Button onClick={handleCancelEdit}>Cancel</Button>
                        ) : (
                            <Button onClick={() => setIsEditMode(true)}>Edit Profile</Button>
                        )}
                    </CardContent>
                </Card>

                {/* Tabs Section */}
                <Tabs defaultValue="overview" className="w-full mt-5">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                        {/* <TabsTrigger value="availability" className="cursor-pointer">Availability</TabsTrigger>
                        <TabsTrigger value="reviews" className="cursor-pointer">Reviews</TabsTrigger> */}
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {formContent[0]}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className='md:col-span-1'>
                                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                                <FancyFileUpload
                                                    label="Upload Profile Image"
                                                    accept="image/*"
                                                    multiple={false}
                                                    onFileSelect={(files) => handleFileChange(files, 'profileImage')}
                                                    currentFile={typeof formData.profileImage === 'string' ? null : formData.profileImage}
                                                />
                                            </div>
                                            {formData.profileImage && (
                                                <div className="mt-2" >
                                                    <img
                                                    src={
                                                        typeof formData.profileImage === 'string'
                                                        ? formData.profileImage
                                                        : formData.profileImage
                                                        ? URL.createObjectURL(formData.profileImage)
                                                        : '/images/user-placeholder.jpg' // fallback image
                                                    }
                                                    alt="Profile Preview"
                                                    className="w-40 h-40 object-cover border"
                                                    />
                                                </div>
                                            )}
                                            {validationErrors.profileImage && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                                    <FaExclamationCircle className="mr-1" />
                                                    {validationErrors.profileImage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            {/* <p><strong>About:</strong> {providerDetails.bio}</p> */}
                            </CardContent>
                            {isEditMode && (
                                <CardFooter className="flex justify-end">
                                    <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditMode(false);
                                    }}
                                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                                    >
                                    Cancel
                                    </button>
                                    <button
                                    type="button"
                                    onClick={handleUpdateUserProfileForm}
                                    className="px-4 py-2 bg-[#F15A29] text-white rounded hover:bg-[#d94c1f] cursor-pointer"
                                    >
                                    Update
                                    </button>
                                </CardFooter>
                            )}
                        </Card>
                    </TabsContent>

                    {/* Availability Tab */}
                    {/* <TabsContent value="availability">
                        <Card>
                            <CardContent className="p-6 space-y-2">
                                {Array.isArray(providerAvailability) && providerAvailability.map((r) => {
                                    const utcDate = new Date(r.availabilityDate); // ISO 8601 to Date
                                    const localDate = new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000)); // convert to local time
                                    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    const dayName = daysOfWeek[localDate.getDay()];

                                    return (
                                    <p key={r._id} className="text-sm text-gray-600">
                                        {dayName}: {r.availabilityStartTime} - {r.availabilityEndTime}
                                    </p>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </TabsContent> */}

                    {/* Reviews Tab */}
                    {/* <TabsContent value="reviews">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                            {Array.isArray(reviewList) && reviewList.map((r) => (
                                <div key={r._id} className="p-4 border rounded space-y-1 shadow-sm">
                                    <p className="font-medium">{r.userId?.name || 'Unknown User'}</p>
                                    <p className="text-xs text-gray-500">{new Date(r.createdAt).toDateString()}</p>
                                    <p>{r.review}</p>
                                    <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < r.rating ? "#facc15" : "none"} />
                                    ))}
                                    </div>
                                </div>
                            ))}
                            </CardContent>
                        </Card>
                    </TabsContent> */}
                </Tabs>
            </div>
        </>
    )
}