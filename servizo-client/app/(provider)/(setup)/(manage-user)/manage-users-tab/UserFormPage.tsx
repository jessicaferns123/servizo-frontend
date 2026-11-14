'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ManageUsersForm from '@/components/manage-user/ManageUsersForm';
import ManageUsersRights from '@/components/manage-user/ManageUsersRights';

export default function UserFormPage() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const userId = searchParams.get('id');

  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit && userId) {
        console.log('is edit mode')
        getProviderByIdDetails();
    //   fetch(`http://localhost:3000/provider/getProviderById/${userId}`)
    //     .then((res) => res.json())
    //     .then((data) => setUserData(data.Result));
    }
  }, [isEdit, userId]);

  const getProviderByIdDetails = async () => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`http://localhost:3000/provider/getProviderById/${userId}`, {
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
        setUserData(data['Result'])
    } catch (err:any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  if (isEdit && !userData) return <div>Loading...</div>;

  return (
    <div className='pt-25 pb-20'>
      <div className="p-6 bg-white">
        <div>
        {isEdit ? (
            <Tabs defaultValue="user-form" className="w-full">
            <TabsList className="mb-4 w-full h-12">
                <TabsTrigger value="user-form" className='cursor-pointer'>User Details</TabsTrigger>
                <TabsTrigger value="user-rights" className='cursor-pointer'>User Rights</TabsTrigger>
            </TabsList>
            <TabsContent value="user-form">
                <ManageUsersForm isEdit={true} data={userData} />
            </TabsContent>
            <TabsContent value="user-rights">
                <ManageUsersRights userId={userId as string} />
            </TabsContent>
            </Tabs>
        ) : (
            <Tabs defaultValue="user-form" className="w-full">
                <TabsList className="mb-4 w-full h-12">
                    <TabsTrigger value="user-form" className='cursor-pointer'>User Details</TabsTrigger>
                </TabsList>
                <TabsContent value="user-form">
                    <ManageUsersForm isEdit={false} />
                </TabsContent>
            </Tabs>
        )}
        </div>
      </div>
    </div>
  );
}
