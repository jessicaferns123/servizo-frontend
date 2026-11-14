'use client';

import FancyFileUpload from '@/components/shared/FileUpload';
import { MultiSelectField } from '@/components/shared/MultiSelectField';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaExclamationCircle } from 'react-icons/fa';

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
    isActive: boolean;
};

type Role = {
  roleid: string;
  rolename: string;
};

type Gender = {
  genderid: string;
  gendername: string;
};

type FormDataType = {
  fullname: string;
  email: string;
  mobilenumber: string;
  username: string;
  password: string;
  gender: string;
  nationalityid: string;
  nationalityname: string;
  experience: string;
  preferredlanguage: string[]; // ✅ This needs to be typed
  countryid: string;
  countryname: string;
  cityid: string;
  cityname: string;
  streetaddress: string;
  landmark: string;
  postalcode: string;
  latitude: number;
  longitude: number;
  emiratesId: File | null;
  passport: File | null;
  profileImage: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  status: string;
  claims: string[]; // ✅ Also needs to be typed
  createdAt: string;
};

export default function ManageUsersForm({ isEdit, data }: { isEdit: boolean, data?: any }) {
  const router = useRouter();
  const [setFormIsActive, setFormIsActiveDetail] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formSubmitError, setFormSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

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

  const [formData, setFormData] = useState<FormDataType>({
    fullname: "",
    email: "",
    mobilenumber: "",
    username: "",
    password: "",
    gender: "",
    nationalityid: "",
    nationalityname: "",
    experience: "",
    preferredlanguage: [],

    countryid: "",
    countryname: "",
    cityid: "",
    cityname: "",
    streetaddress: "",
    landmark: "",
    postalcode: "",

    latitude: 0,
    longitude: 0,
    emiratesId: null,
    passport: null,
    profileImage: "",
    
    role: "",
    isVerified: true,
    isActive: false,
    status: "approved",
    claims: [],
    createdAt: new Date().toISOString()
  });

  const [roleListData, setRoleListData] = useState<Role[]>([
    {
        roleid: "admin",
        rolename: "Admin"
    },
    {
        roleid: "provider",
        rolename: "Provider",
    }
  ])

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

  const formContent = [
    <>
        {renderInputField("username", "Username", "text", false, "")}
        {renderInputField("password", "Password", "text", false, "")}
        {renderSelectField(
            "role",
            "Role",
            formData.role,
            (value) => {
                const selectedRole = roleListData.find(
                    (role) => role.roleid === value
                );
                if (selectedRole) {
                    handleSelectChange("role", selectedRole.roleid);
                }
            },
            roleListData.map(c => ({ id: c.roleid, name: c.rolename })),
            "Select your role"
        )}
        {renderInputField("fullname", "Full Name", "text", false, "John Doe")}
        {renderInputField("mobilenumber", "Mobile Number", "text", false, "5xxxxxxxx")}
        {renderInputField("email", "Email", "text", false, "test@example.com")}
        {renderSelectField(
            "gender",
            "Gender",
            formData.gender,
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
            (value) => {
                const selectedNationality = countries.find(
                    (nation) => nation._id === value
                );
                if (selectedNationality) {
                    handleSelectChange("nationalityid", selectedNationality._id);
                    handleSelectChange("nationalityname", selectedNationality.countryname);
                }
            },
            countries.map(c => ({ id: c._id, name: c.countryname })),
            "Select your Nationality"
        )}
        {renderInputField("experience", "Experience", "text", false, "")}
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
                        handleSelectChange("countryname", selectedCountry.countryname);
                        fetchCitiesByCountry(selectedCountry._id);
                        handleSelectChange("cityid", ""); // Reset city when country changes
                        handleSelectChange("cityname", ""); // Reset city name when country changes
                    }
                },
                countries.map(c => ({ id: c._id, name: c.countryname })),
                "Select your country"
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
                    handleSelectChange("cityname", selectedCity.cityname);
                }
            },
            cities.map(c => ({ id: c._id, name: c.cityname })),
            "Select your city"
        )}
        {renderInputField("streetaddress", "Street Address", "text", false, "")}
        {renderInputField("landmark", "Landmark", "text", false, "")}
        {renderInputField("postalcode", "Postal Code", "text", false, "")}
        {renderMultiSelectField("preferredlanguage", "Preferred Language", formData.preferredlanguage, false, (vals) => setFormData({ ...formData, preferredlanguage: vals }), languageOptions, "Select languages")}
    </>
  ]

  useEffect(() => {
    fetchCountries();

    if(isEdit){
        setIsEditMode(isEdit);
        setFormData(data);
        setFormIsActiveDetail(data.isActive);
        setEditingUserId(data._id)

        fetchCitiesByCountry(formData.countryid);
    }

  }, []);

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

  const fetchCitiesByCountry = async (countryId: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("authToken");
    e.preventDefault();
    try {
        console.log(formData)
        formData.isActive = setFormIsActive;

        const response = await fetch('http://localhost:3000/provider/addNewUser', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success("User added successfully")
            router.push("/manage-users-list");
        } else {
            toast.error('Something went wrong');
        }
        
    } catch (error) {
        console.error('Error :', error);
    }
  };

  const handleUpdateUserForm = async (e: React.FormEvent) => {
    const token = localStorage.getItem("authToken");
    e.preventDefault();
    if (!editingUserId) return;

    try {
        console.log(formData)

        formData.isActive = setFormIsActive;

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
            toast.success("User updated successfully")
            router.push("/manage-users-list");
        } else {
            toast.error('Something went wrong');
        }   
    } catch (error) {
        console.error('Error :', error);
    }
  }

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className='md:col-span-1'>
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <FancyFileUpload
                        label="Upload Emirates ID"
                        accept="image/*,.pdf"
                        multiple={false}
                        onFileSelect={(files) => handleFileChange(files, 'emiratesId')}
                        currentFile={formData.emiratesId} // Pass current file for display
                    />
                </div>
                {validationErrors.emiratesId && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <FaExclamationCircle className="mr-1" />
                        {validationErrors.emiratesId}
                    </p>
                )}
            </div>
            <div className='md:col-span-1'>
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <FancyFileUpload
                        label="Upload Passport"
                        accept="image/*,.pdf"
                        multiple={false}
                        onFileSelect={(files) => handleFileChange(files, 'passport')}
                        currentFile={formData.passport} // Pass current file for display
                    />
                </div>
                {validationErrors.passport && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <FaExclamationCircle className="mr-1" />
                        {validationErrors.passport}
                    </p>
                )}
            </div>
        </div>
        {formSubmitError && <p className="text-red-500 text-sm">{formSubmitError}</p>}
        <div className="flex justify-end mt-6">
            <button
            type="button"
            onClick={() => {
                router.push(`/manage-user-list`);
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
  );
}
