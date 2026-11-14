'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  _id: string;
  fullname: string;
  email: string;
  mobilenumber: string;
  countryname: string;
  cityname: string;
  streetaddress: string;
  landmark: string;
  postalcode: string;
  emiratesId: string;
  passport: string;
  profileImage?: string;
  status: string;
  createdAt: Date;
  isActive: boolean
}

export default function ApprovalsForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const router = useRouter();

  const [formSubmitError, setFormSubmitError] = useState('');

//   const [setFormIsActive, setFormIsActiveDetail] = useState(false);
  const [setFormIsVerified, setFormIsVerifiedDetail] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [requestRemarks, setRequestRemarks] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem('authToken');
        const payload = {userid: userId};

        try {
            const response = await fetch('http://localhost:3000/provider/pending-user-details', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to fetch user details');

            const data = await response.json();

            setUser(data['Result']);
            // setFormIsActiveDetail(data['Result']['isActive']);
            setFormIsVerifiedDetail(data['Result']['isVerified'])
        } catch (error) {
            console.error("Failed to load user", error);
        }
    };
    fetchUser();
  }, []);

   const handleUpdateApprovalRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitError("");

        const token = localStorage.getItem("authToken");

        if (!requestStatus) {
            setFormSubmitError("Please select a request status.");
            return;
        }

        const payload = {
            userid: userId,
            status: requestStatus,
            // isActive: setFormIsActive,
            isVerified: setFormIsVerified,
            remarks: requestRemarks,
        };

        try {
            const response = await fetch("http://localhost:3000/provider/update-user-approval-request", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to update user status");

            const result = await response.json();
            toast.success("User approval updated successfully");
            router.push("/approvals-list");
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update user approval");
            setFormSubmitError("Something went wrong while updating the approval.");
        }
   }

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className='pt-25 pb-20'>
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            </div>

            <form onSubmit={handleUpdateApprovalRequest}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 card-layout">
                    <div className="md:col-span-4 mb-4 breaker">
                        <h3 className="text-md font-semibold mb-4">Member Details</h3>
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                        <input 
                            type="text"
                            value={user.fullname} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Email</label>
                        <input 
                            type="text"
                            value={user.email} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Mobile Number</label>
                        <input 
                            type="text"
                            value={user.mobilenumber} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Requested Date</label>
                        <input 
                            type="text"
                            value={new Date(user.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            })} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Country</label>
                        <input 
                            type="text"
                            value={user.countryname} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">City</label>
                        <input 
                            type="text"
                            value={user.cityname} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Street Address</label>
                        <input 
                            type="text"
                            value={user.streetaddress} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Landmark</label>
                        <input 
                            type="text"
                            value={user.landmark} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium">Postal Code</label>
                        <input 
                            type="text"
                            value={user.postalcode} readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 card-layout mt-5">
                    <div className="md:col-span-4 mb-4 breaker">
                        <h3 className="text-md font-semibold mb-4">Manager Action</h3>
                    </div>
                    {/* <div className="md:col-span-1 flex items-center gap-3">
                        <Checkbox id="terms" checked={setFormIsActive} onCheckedChange={(checked) => setFormIsActiveDetail(!!checked)}/>
                        <Label htmlFor="terms">Status</Label>
                    </div> */}
                    <div className="md:col-span-1 flex items-center gap-3">
                        <Checkbox id="terms" checked={setFormIsVerified} onCheckedChange={(checked) => setFormIsVerifiedDetail(!!checked)}/>
                        <Label htmlFor="terms">Verified</Label>
                    </div>
                    <div className="md:col-span-1 flex items-center gap-3"></div>
                    <div className="md:col-span-1 flex items-center gap-3"></div>
                    <div className="md:col-span-1 flex items-center gap-3"></div>
                    <div className="md:col-span-1">
                        <Label className='mb-2' htmlFor="RequestStatus">Request Status</Label>
                        <Select value={requestStatus} onValueChange={(value) => setRequestStatus(value)}>
                            <SelectTrigger id="RequestStatus" className={`w-full ${!requestStatus && formSubmitError ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium">Remarks</label>
                        <input 
                            type="text"
                            value={requestRemarks} onChange={(e) => setRequestRemarks(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </div>
                </div>
                {formSubmitError && <p className="text-red-500 text-sm">{formSubmitError}</p>}
                <div className="flex justify-end mt-6">
                    <button
                    type="button"
                    onClick={() => {
                        router.push(`/approvals-list`);
                    }}
                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 bg-[#F15A29] text-white rounded hover:bg-[#d94c1f] cursor-pointer"
                    >
                    Update
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
