'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Rights {
  _id:string;
  claimType: string;
  claimValue: string;
  claimDescription: string;
  isRestricted: boolean;
}

export default function ClaimsList() {
const [providerRights, setProviderRights] = useState<Rights[]>([]);

const [isEditMode, setIsEditMode] = useState(false);
const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
const [setFormClaimType, setFormClaimTypeDetail] = useState('');
const [setFormClaimValue, setFormClaimValueDetail] = useState('');
const [setFormClaimDescription, setFormClaimDescriptionDetail] = useState('');
const [setFormIsRestricted, setFormIsRestrictedDetail] = useState(false);

const [showModal, setShowModal] = useState(false);

const [formSubmitError, setFormSubmitError] = useState('');
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProviderRights();
}, []);

const fetchProviderRights = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('http://localhost:3000/provider/getUserClaim', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch user claims');

    const data = await response.json();
    
    setProviderRights(data['Result']);
  } catch (err: any) {
    setError(err.message);
  }
};

const handleAddRightForm = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem('authToken');

        // Basic frontend validation
        if (
            !setFormClaimType ||
            !setFormClaimValue ||
            !setFormClaimDescription ||
            !setFormIsRestricted
        ) {
            setFormSubmitError('Please fill in all required fields.');
            return;
        }
        
        const payload = {
            claimType: setFormClaimType,
            claimValue: setFormClaimValue,
            claimDescription: setFormClaimDescription,
            isRestricted: setFormIsRestricted
        };
        console.log(payload);

        try {
            const response = await fetch('http://localhost:3000/provider/addNewClaim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('New claim added successfully!')
                resetForm();
                fetchProviderRights();
             } else {
                console.log('Something went wrong');
            }

        } catch (error) {
            console.error('Error during adding new claim:', error);
        }
}

const handleEditRights = (claim: any) => {
  setIsEditMode(true);
  setEditingClaimId(claim._id);
  setFormClaimTypeDetail(claim.claimType);
  setFormClaimValueDetail(claim.claimValue);
  setFormClaimDescriptionDetail(claim.claimDescription);
  setFormIsRestrictedDetail(claim.isRestricted);
  setShowModal(true);
};

const handleUpdateRightForm = async () => {
  const token = localStorage.getItem('authToken');
  if (!editingClaimId) return;

  const payload = {
    claimType: setFormClaimType,
    claimValue: setFormClaimValue,
    claimDescription: setFormClaimDescription,
    isRestricted: setFormIsRestricted,
  };

  try {
    const response = await fetch(`http://localhost:3000/provider/updateUserClaim/${editingClaimId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success('Claim updated successfully!');
      resetForm();
      fetchProviderRights();
    } else {
      toast.error('Failed to update claim');
    }
  } catch (error) {
    console.error('Update error:', error);
  }
};

const resetForm = () => {
  setShowModal(false);
  setIsEditMode(false);
  setEditingClaimId(null);
  setFormClaimTypeDetail('');
  setFormClaimValueDetail('');
  setFormClaimDescriptionDetail('');
  setFormIsRestrictedDetail(false);
  setFormSubmitError('');
};

  return (
    <div className='pt-25 pb-20'>
      <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4">Rights List</h2>
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
                  <th className="py-2 px-4 border-b font-semibold text-left">Claim Type</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Claim Value</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Claim Description</th>
                  <th className="py-2 px-4 border-b font-semibold text-left">Claim Restricted</th>
                </tr>
              </thead>
              <tbody>
                {providerRights.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No rights available
                    </td>
                  </tr>
                ) : (
                  providerRights.map((claim) => (
                    <tr key={claim._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => handleEditRights(claim)} className="bg-gray-50 hover:bg-gray-200 text-blue-600 py-1 px-2 rounded mr-2 text-sm cursor-pointer">
                        Edit
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">{claim.claimType}</td>
                      <td className="py-2 px-4 border-b">{claim.claimValue}</td>
                      <td className="py-2 px-4 border-b">{claim.claimDescription}</td>
                      <td className="py-2 px-4 border-b">
                        {claim.isRestricted ? <span className='yes'>Yes</span> : <span className='no'>No</span>}
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
                setFormClaimTypeDetail('');
                setFormClaimValueDetail('');
                setFormClaimDescriptionDetail('');
                setFormIsRestrictedDetail(false);
                setFormSubmitError('');
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {isEditMode ? 'Edit Claim' : 'Add New Claim'}
            </h3>
            <form onSubmit={handleAddRightForm}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1 flex items-center gap-3">
                  <Checkbox id="terms" checked={setFormIsRestricted} onCheckedChange={(checked) => setFormIsRestrictedDetail(!!checked)}/>
                  <Label htmlFor="terms">Restricted</Label>
                </div>

                <div className="md:col-span-1"></div>

                <div className="md:col-span-1">
                  <label htmlFor="claimtype" className="block text-sm font-medium">Claim Type</label>
                  <input 
                      type="text"
                      value={setFormClaimType} 
                      onChange={(e) => setFormClaimTypeDetail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    />
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="claimvalue" className="block text-sm font-medium">Claim Value</label>
                  <input
                      type="text"
                      value={setFormClaimValue} 
                      onChange={(e) => setFormClaimValueDetail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium">Claim Description</label>
                  <input
                      type="text"
                      value={setFormClaimDescription} 
                      onChange={(e) => setFormClaimDescriptionDetail(e.target.value)}
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
                  setFormClaimTypeDetail('');
                  setFormClaimValueDetail('');
                  setFormClaimDescriptionDetail('');
                  setFormIsRestrictedDetail(false);
                  setFormSubmitError('');
                }}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                >
                Cancel
                </button>
                {isEditMode ? (
                  <button
                    type="button"
                    onClick={handleUpdateRightForm}
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
  );
}
