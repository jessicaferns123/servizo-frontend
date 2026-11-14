'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import MapSelector from '@/components/shared/MapSelectorClient';
import FancyFileUpload from '@/components/shared/FileUpload';
import { FaExclamationCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { MultiSelectField } from '@/components/shared/MultiSelectField';

const steps = ['Personal Information', 'Address & Location', 'Documents', 'Review Details'];

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
  confirmpassword: string;
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

export default function ProviderRegister() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    fullname: "",
    email: "",
    mobilenumber: "",
    username: "",
    password: "",
    confirmpassword: "",
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
    
    role: "provider",
    isVerified: false,
    isActive: false,
    status: "pending",
    claims: [],
    createdAt: new Date().toISOString()
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [stepHasErrors, setStepHasErrors] = useState<boolean[]>(new Array(steps.length).fill(false));

  const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 0));
        setValidationErrors({});
    };

  useEffect(() => {
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
    
        fetchCountries();
 }, []);

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

  const validateStep = (currentStep: number): boolean => {
        let errors: { [key: string]: string } = {};
        let isValid = true;

        // Reset errors for the current step
        const newStepHasErrors = [...stepHasErrors];
        newStepHasErrors[currentStep] = false;

        if (currentStep === 0) { // Personal Information
            if (!formData.fullname.trim()) {
                errors.fullname = 'Full Name is required.';
                isValid = false;
            }
            if (!formData.email.trim()) {
                errors.email = 'Email is required.';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = 'Email is invalid.';
                isValid = false;
            }
            if (!formData.mobilenumber.trim()) {
                errors.mobilenumber = 'Mobile Number is required.';
                isValid = false;
            } else if (!/^\+?\d{7,15}$/.test(formData.mobilenumber)) {
                errors.mobilenumber = 'Mobile Number is invalid.';
                isValid = false;
            }
            if (!formData.password) {
                errors.password = 'Password is required.';
                isValid = false;
            } else if (formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters.';
                isValid = false;
            }
            if (formData.password !== formData.confirmpassword) {
                errors.confirmpassword = 'Passwords do not match.';
                isValid = false;
            }
            if (!formData.experience) {
                errors.experience = 'Experience is required.';
                isValid = false;
            }
            if (!formData.preferredlanguage) {
                errors.experiencpreferredlanguagee = 'Preferred Language is required.';
                isValid = false;
            }
        } else if (currentStep === 1) { // Address & Location
            if (!formData.countryid) {
                errors.countryid = 'Country is required.';
                isValid = false;
            }
            if (!formData.cityid) {
                errors.cityid = 'City is required.';
                isValid = false;
            }
            if (!formData.streetaddress.trim()) {
                errors.streetaddress = 'Street Address is required.';
                isValid = false;
            }
            if (!formData.postalcode.trim()) {
                errors.postalcode = 'Postal Code is required.';
                isValid = false;
            }
            if (formData.latitude === 0 && formData.longitude === 0) {
                errors.maplocation = 'Please select your location on the map.';
                isValid = false;
            }
        } else if (currentStep === 2) { // Documents
            // if (!formData.emiratesId) {
            //     errors.emiratesId = 'Emirates ID is required.';
            //     isValid = false;
            // }
            // if (!formData.passport) {
            //     errors.passport = 'Passport is required.';
            //     isValid = false;
            // }
        }

        setValidationErrors(errors);
        if (!isValid) {
            newStepHasErrors[currentStep] = true;
        }
        setStepHasErrors(newStepHasErrors);
        return isValid;
    };

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

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleSubmit = async () => {
    try {
        if (validateStep(step)) {
            console.log(formData)
            const response = await fetch('http://localhost:3000/global/auth/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Registration successful! Your account is under review. You’ll be notified once approved by the admin.')
                router.push('/home');
            } else {
                toast.error('Registration failed');
            }
        } else {
            alert('Please correct the errors before submitting.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
};

  // const stepContent = [
  //   <>
  //     <Label>Full Name</Label>
  //     <Input name="fullname" value={formData.fullname} onChange={handleChange} placeholder="John Doe" />
      
  //     <Label>Email</Label>
  //     <Input name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />

  //     <Label>Mobile Number</Label>
  //     <Input name="mobilenumber" value={formData.mobilenumber} onChange={handleChange} placeholder="+971..." />

  //     <Label>Password</Label>
  //     <Input name="password" value={formData.password} onChange={handleChange} />

  //     <Label>Confirm Password</Label>
  //     <Input name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} />
  //   </>,
  //   <>
  //     <Label>Country</Label>
  //     <Select
  //       onValueChange={(value) => {
  //           const selectedCountry = countries.find(
  //           (country) => country.countryid === Number(value)
  //           );
  //           if (selectedCountry) {
  //               handleSelectChange("countryid", selectedCountry.countryid.toString());
  //               handleSelectChange("countryname", selectedCountry.countryname);
  //               fetchCitiesByCountry(selectedCountry.countryid);
  //           }
  //       }}
  //       value={formData.countryid || ""}
  //       >
  //       <SelectTrigger id="country" className="w-full">
  //         <SelectValue placeholder="Select your country" />
  //       </SelectTrigger>

  //       <SelectContent>
  //         {countries.map((country) => (
  //           <SelectItem
  //             key={country.countryid}
  //             value={country.countryid.toString()}
  //           >
  //             {country.countryname}
  //           </SelectItem>
  //         ))}
  //       </SelectContent>
  //     </Select>

  //     <Label>City</Label>
  //     <Select
  //       onValueChange={(value) => {
  //           const selectedCity = cities.find(
  //           (city) => city.cityid === Number(value)
  //           );
  //           if (selectedCity) {
  //               handleSelectChange("cityid", selectedCity.cityid.toString());
  //               handleSelectChange("cityname", selectedCity.cityname);
  //               //fetchAreasByCity(selectedCity.cityid);
  //           }
  //       }}
  //       value={formData.cityid || ""}
  //       >
  //       <SelectTrigger id="city" className="w-full">
  //         <SelectValue placeholder="Select your city" />
  //       </SelectTrigger>

  //       <SelectContent>
  //         {cities.map((city) => (
  //           <SelectItem
  //             key={city.cityid}
  //             value={city.cityid.toString()}
  //           >
  //             {city.cityname}
  //           </SelectItem>
  //         ))}
  //       </SelectContent>
  //     </Select>

  //     <Label>Street Address</Label>
  //     <Textarea name='streetaddress' value={formData.streetaddress} onChange={handleTextareaChange} />

  //     <Label>Landmark</Label>
  //     <Input name="landmark" value={formData.landmark} onChange={handleChange} />

  //     <Label>Postal Code</Label>
  //     <Input name="postalcode" value={formData.postalcode} onChange={handleChange} />

  //     <Label>Select Location on Map</Label>
  //     <MapSelector
  //       setLatitude={(lat:number) => setFormData((prev) => ({ ...prev, latitude: lat }))}
  //       setLongitude={(lng:number) => setFormData((prev) => ({ ...prev, longitude: lng }))}
  //     />
  //     <p className="text-sm mt-2">
  //       Selected Coordinates: {formData.latitude}, {formData.longitude}
  //     </p>
  //   </>,
  //   <>
  //     <div className="space-y-6">
  //       <div className="flex flex-col md:flex-row md:items-center md:gap-4">
  //         <FancyFileUpload
  //           label="Upload Emirates ID"
  //           accept="image/*,.pdf"
  //           multiple={false}
  //           onFileSelect={(files) => {
  //             if (files) {
  //               setFormData((prev) => ({ ...prev, emiratesId: files[0] }));
  //             }
  //           }}
  //         />
  //       </div>

  //       <div className="flex flex-col md:flex-row md:items-center md:gap-4">
  //         <FancyFileUpload
  //           label="Upload Passport"
  //           accept="image/*,.pdf"
  //           multiple={false}
  //           onFileSelect={(files) => {
  //             if (files) {
  //               console.log(files);
  //               setFormData((prev) => ({ ...prev, passport: files[0] }));
  //               console.log(formData)
  //             }
  //           }}
  //         />
  //       </div>
  //     </div>
  //   </>,
  //   <>
  //     <p className="text-sm text-muted-foreground">Please review your details before submitting:</p>
  //     <ul className="text-sm space-y-3 mt-2">
  //       <li><strong>Name:</strong> {formData.fullname}</li>
  //       <li><strong>Email:</strong> {formData.email}</li>
  //       <li><strong>Mobile Number:</strong> {formData.mobilenumber}</li>
  //       <li><strong>Country:</strong> {formData.countryname}</li>
  //       <li><strong>City:</strong> {formData.cityname}</li>
  //       <li><strong>Street Address:</strong> {formData.streetaddress}</li>
  //       <li><strong>Landmark:</strong> {formData.landmark}</li>
  //       <li><strong>Postal Code:</strong> {formData.postalcode}</li>
  //       <li><strong>Status:</strong> <span className='text-red-500'>{formData.status}</span></li>
  //     </ul>
  //   </>,
  // ];


  // Helper to render input fields with error messages
    const renderInputField = (name: string, label: string, type: string = "text", placeholder?: string) => (
        <div className="mb-4">
            <Label className='mb-2' htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                value={(formData as any)[name]}
                onChange={handleChange}
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

    // Helper to render Select fields with error messages
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

    const renderTextareaField = (name: string, label: string) => (
        <div className="mb-4">
            <Label className='mb-2' htmlFor={name}>{label}</Label>
            <Textarea
                id={name}
                name={name}
                value={(formData as any)[name]}
                onChange={handleTextareaChange}
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

    const stepContent = [
        <>
            {renderInputField("fullname", "Full Name", "text", "John Doe")}
            {renderInputField("email", "Email", "email", "john@example.com")}
            {renderInputField("mobilenumber", "Mobile Number", "text", "+971...")}
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
            {renderInputField("experience", "Experience", "text", "")}
            {renderMultiSelectField("preferredlanguage", "Languages Known", formData.preferredlanguage, false, (vals) => setFormData({ ...formData, preferredlanguage: vals }), languageOptions, "Select languages")}
            {renderInputField("username", "Username")}
            {renderInputField("password", "Password", "password")}
            {renderInputField("confirmpassword", "Confirm Password", "password")}
        </>,
        <>
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

            {renderTextareaField("streetaddress", "Street Address")}
            {renderInputField("landmark", "Landmark")}
            {renderInputField("postalcode", "Postal Code")}

            <Label>Select Location on Map</Label>
            <MapSelector
                setLatitude={(lat: number) => {
                    setFormData((prev) => ({ ...prev, latitude: lat }));
                    setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.maplocation;
                        return newErrors;
                    });
                }}
                setLongitude={(lng: number) => {
                    setFormData((prev) => ({ ...prev, longitude: lng }));
                    setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.maplocation;
                        return newErrors;
                    });
                }}
            />
            <p className="text-sm mt-2">
                Selected Coordinates: {formData.latitude}, {formData.longitude}
            </p>
            {validationErrors.maplocation && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {validationErrors.maplocation}
                </p>
            )}
        </>,
        <>
            <div className="space-y-6">
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
        </>,
        <>
            <p className="text-sm text-muted-foreground">Please review your details before submitting:</p>
            <ul className="text-sm space-y-3 mt-2">
                <li><strong>Name:</strong> {formData.fullname || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Email:</strong> {formData.email || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Mobile Number:</strong> {formData.mobilenumber || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Gender:</strong> {formData.gender || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Nationality:</strong> {formData.nationalityname || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Experience:</strong> {formData.experience || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Languages Known:</strong> {formData.preferredlanguage.toString() || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Country:</strong> {formData.countryname || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>City:</strong> {formData.cityname || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Street Address:</strong> {formData.streetaddress || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Landmark:</strong> {formData.landmark || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Postal Code:</strong> {formData.postalcode || <span className="text-muted-foreground">N/A</span>}</li>
                <li><strong>Emirates ID:</strong> {formData.emiratesId ? formData.emiratesId.name : <span className="text-muted-foreground">Not uploaded</span>}</li>
                <li><strong>Passport:</strong> {formData.passport ? formData.passport.name : <span className="text-muted-foreground">Not uploaded</span>}</li>
                <li><strong>Location:</strong> {formData.latitude !== 0 || formData.longitude !== 0 ? `${formData.latitude}, ${formData.longitude}` : <span className="text-muted-foreground">Not selected</span>}</li>
                <li><strong>Status:</strong> <span className='text-red-500'>{formData.status}</span></li>
            </ul>
        </>,
    ];

  return (
    <div className="flex flex-col p-8 items-center justify-center min-h-screen bg-gray-100 bg-[url('/provider-bg.jpg')]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Provider Registration
            </h2>

            <div className="max-w-xl mx-auto mt-10 rounded-2xl">
                <div>
                    <div className="flex justify-between items-center mb-4">
                    {steps.map((label, idx) => (
                        <div
                        key={label}
                        className={cn(
                            'flex-1 text-center text-xs font-semibold transition',
                            idx === step
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                        >
                        <div
                            className={cn(
                            'w-3 h-3 rounded-full mx-auto mb-1',
                            idx === step ? 'bg-primary' : 'bg-muted'
                            )}
                        />
                        {label}
                        </div>
                    ))}
                    </div>
                </div>

                <div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {stepContent[step]}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={prevStep} disabled={step === 0}>
                            Back
                        </Button>
                        {step < steps.length - 1 ? (
                            <Button onClick={nextStep}>Next</Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-[#F15A29] text-white">
                            Submit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}