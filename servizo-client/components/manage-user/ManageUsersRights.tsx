'use client';

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Claims {
  claimId:string;
  claimType: string;
  claimValue: string;
  key: string;
  IsRestricted: boolean;
}

export default function ManageUsersRights({ userId }: { userId: string }) {
const [assignedClaims, setAssignedClaims] = useState<Claims[]>([]);
const [unassignedClaims, setUnassignedClaims] = useState<Claims[]>([])

const [error, setError] = useState(null);

useEffect(() => {
    fetchUsersClaimList();
},[]);

const fetchUsersClaimList = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`http://localhost:3000/provider/getAllUserClaims?userId=${userId}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Failed to fetch user claims');

    const data = await response.json();
    
    setAssignedClaims(data['Result']['assigned']);
    setUnassignedClaims(data['Result']['unassigned']);
  } catch (err: any) {
    setError(err.message);
  }
};

const assignRight = async (claim: Claims) => {
  const token = localStorage.getItem('authToken');

  try {
    const res = await fetch('http://localhost:3000/provider/assignUserClaim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId, 
        claimType: claim.claimType,
        claimValue: claim.claimValue,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Assign failed: ${error.message}`);
      return;
    }

    // Update UI if success
    setAssignedClaims((prev) => [...prev, claim]);
    setUnassignedClaims((prev) => prev.filter((c) => c.key !== claim.key));
  } catch (err) {
    alert('Error assigning claim.');
    console.error(err);
  }
};

const unassignRight = async (claim: Claims) => {
  const token = localStorage.getItem('authToken');

  try {
    const res = await fetch('http://localhost:3000/provider/unassignUserClaim', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        claimType: claim.claimType,
        claimValue: claim.claimValue,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Unassign failed: ${error.message}`);
      return;
    }

    // Update UI if success
    setUnassignedClaims((prev) => [...prev, claim]);
    setAssignedClaims((prev) => prev.filter((c) => c.key !== claim.key));
  } catch (err) {
    alert('Error unassigning claim.');
    console.error(err);
  }
};

return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Unassigned Rights Table */}
      <div>
        <h3 className="text-md font-semibold bg-gray-100 p-3 border">Rights Available to Assign</h3>
        <table className="w-full border border-gray-200 text-sm mt-1">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-2 border-b">Action</th>
              <th className="p-2 border-b">Rights Type</th>
              <th className="p-2 border-b">Rights Value</th>
            </tr>
          </thead>
          <tbody>
            {unassignedClaims.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  unassignedClaims.map((claim) => (
                    <tr key={claim.key} className="even:bg-red-50 odd:bg-red-100">
                      <td className="p-2 border-b text-center">
                        <button
                          onClick={() => assignRight(claim)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Plus size={16} />
                        </button>
                      </td>
                      <td className="p-2 border-b">{claim.claimType}</td>
                      <td className="p-2 border-b">{claim.claimValue}</td>
                    </tr>
                  ))
                )
            }
          </tbody>
        </table>
      </div>

      {/* Assigned Rights Table */}
      <div>
        <h3 className="text-md font-semibold bg-gray-100 p-3 border">Assigned Rights</h3>
        <table className="w-full border border-gray-200 text-sm mt-1">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-2 border-b">Action</th>
              <th className="p-2 border-b">Rights Type</th>
              <th className="p-2 border-b">Rights Value</th>
            </tr>
          </thead>
          <tbody>
            {assignedClaims.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No Data Found
                </td>
              </tr>
            ) : (
              assignedClaims.map((claim) => (
                <tr key={claim.key} className="even:bg-red-50 odd:bg-red-100">
                  <td className="p-2 border-b text-center">
                    <button
                      onClick={() => unassignRight(claim)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                  <td className="p-2 border-b">{claim.claimType}</td>
                  <td className="p-2 border-b">{claim.claimValue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
)
}