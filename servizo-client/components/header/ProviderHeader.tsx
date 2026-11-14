'use client';

import { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { ProviderUserDropdown } from "../shared/ProviderUserDropdown";
import Logo from "../shared/Logo";
import HamburgerButton from "../shared/MenuHamburger";
import { useRouter } from "next/navigation";

type ProviderDetails = {
  fullname: string;
  profileImage?:string;
  _id:string;
};

export default function ProviderHeader() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [providerDetails, setproviderDetails] = useState<ProviderDetails | null>(null);

    useEffect(() => {
        const details = JSON.parse(localStorage.getItem('providerDetails') || '{}');
        setproviderDetails(details);
    },[])

    const handleUserClaims = (): string[] => {
        const userClaims = localStorage.getItem('userClaims');
        console.log(userClaims)
        return userClaims ? JSON.parse(userClaims) : [];
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsSidebarOpen(false)
    }

    const handleLogout = () => {
  
    };
    
    return (
        <>
            <nav className="bg-white border-b border-gray-200 py-1 fixed top-0 left-0 w-full z-50">
                <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <HamburgerButton onClick={() => setIsSidebarOpen(true)} />

                        <Logo />
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-800">
                            {providerDetails?.fullname || 'User'}
                        </span>

                        <ProviderUserDropdown profileImage={providerDetails?.profileImage} />
                    </div>
                </div>
                </div>
            </nav>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-30"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            >
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <SidebarMenu role='provider' claims={handleUserClaims()} onNavigate={handleNavigation} onLogout={handleLogout} />
            </div>

        </>
    )
}