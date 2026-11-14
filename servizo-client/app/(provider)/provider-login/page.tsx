'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProviderLoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Provider Login State
    const [providerEmail, setProviderEmail] = useState('');
    const [providerPassword, setProviderPassword] = useState('');
    const [providerLoginError, setProviderLoginError] = useState('');

    const handleNavigation = (path: string) => {
        router.push(path);
    };
    
    const handleProviderLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setProviderLoginError('');

        // Basic frontend validation
        if (!providerEmail || !providerPassword) {
            setProviderLoginError('Please provide email and password.');
            return;
        }

        const payload = {
            email: providerEmail,
            password: providerPassword,
        };

        try {
            const response = await fetch('http://localhost:3000/global/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Login successful!');

                // Extract the token from the response
                const token = result.token;

                // Save token and user type in context
                login(token, 'provider');

                setProviderEmail('');
                setProviderPassword('');
                setProviderLoginError('');

                getProviderDetails();
                getProviderRights();

             } else {
                toast.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
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
            localStorage.setItem('providerDetails', JSON.stringify(data['Result']));
            
            handleNavigation('/provider-home');
        } catch (err:any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getProviderRights = async () => {
        const token = localStorage.getItem('authToken');
        const providerDetails = JSON.parse(localStorage.getItem('providerDetails') || '{}');

        const userId = providerDetails._id

        try {
            const response = await fetch(`http://localhost:3000/provider/getUserClaimOnLogin?userId=${userId}`, {
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user claims');

            const data = await response.json();
            
            localStorage.setItem('userClaims', JSON.stringify(data['Result']));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col p-8 items-center justify-center min-h-screen bg-gray-100 bg-[url('/provider-bg.jpg')]">
            <div className="bg-white p-8 rounded-lg shadow-md w-md max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Provider Sign In
                </h2>
                <form className="space-y-4" onSubmit={handleProviderLogin}>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={providerEmail}
                            onChange={(e) => setProviderEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <div className="flex items-center">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <a
                            href="#"
                            className="ml-auto inline-block text-xs text-blue-500 underline-offset-4 hover:underline"
                            >
                            Forgot your password?
                            </a>
                        </div>
                        
                        <input
                            type="password"
                            id="password"
                            value={providerPassword}
                            onChange={(e) => setProviderPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your password"
                        />
                    </div>
                    {providerLoginError && <p className="text-red-500 text-sm">{providerLoginError}</p>}
                    <button
                        type="submit"
                        className="w-full bg-[#F15A29] text-white p-2 rounded-md cursor-pointer mt-5"
                    >
                        Login
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('provider-register')}
                        className="text-[#F15A29] hover:underline cursor-pointer"
                    >
                        Register here
                    </button>
                </p>
                </form>
            </div>
            <Toaster />
        </div>
    )
}