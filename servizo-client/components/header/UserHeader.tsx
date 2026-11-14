'use client';

import { Toaster } from "react-hot-toast";
import Logo from "../shared/Logo";
import { CartButton } from "../shared/CartButton";
import { useCart } from "@/context/CartContext";
import { UserDropdown } from "../shared/UserDropdown";

export default function UserHeader() {
    
    return (
        <>
            <nav className="bg-white border-b-1 border-gray-200 py-1">
                <div className="mx-auto max-w-7xl px-8 sm:px-6 md:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <Logo />

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <CartButton />
                            
                            <div className="relative ml-3">
                                <div>
                                    <UserDropdown />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Customer Auth Modal */}
            {/* <Dialog open={showCustomerAuthModal} onOpenChange={(open) => {
                setShowCustomerAuthModal(open);
                if (!open) {
                    setCustomerAuthMode('login');
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            {customerAuthMode === 'login' ? 'Welcome to Servizo' : 'Create your account'}
                        </DialogTitle>
                        <DialogDescription>
                            {customerAuthMode === 'login' ? 'Sign in to continue as a customer' : 'Fill in the details to register as a customer'}
                        </DialogDescription>
                    </DialogHeader>

                    {customerAuthMode === 'login' ? (
                        <form className="space-y-4 mt-4" onSubmit={handleCustomerLogin}>
                            <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <input type="password" placeholder="Password" value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />

                            {customerLoginError && <p className="text-red-600 text-sm">{customerLoginError}</p>}

                            <button aria-label="Login as Customer" type="submit" className="w-full bg-[#F15A29] text-white p-2 rounded-md cursor-pointer">Login as Customer</button>

                            <p className="text-sm text-center mt-3">
                                Don’t have an account?{' '}
                                <button aria-label="Register Here"
                                    type="button"
                                    onClick={() => {
                                        setCustomerAuthMode('register');
                                        setCustomerEmail('');
                                        setCustomerPassword('');
                                    }}
                                    className="text-[#F15A29] hover:underline cursor-pointer"
                                >
                                    Register here
                                </button>
                            </p>
                        </form>
                    ) : (
                        <form className="space-y-4 mt-4" onSubmit={handleCustomerRegister}>
                            <input type="text" placeholder="Full Name" value={customerRegisterName} onChange={(e) => setCustomerRegisterName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <input type="email" placeholder="Email" value={customerRegisterEmail} onChange={(e) => setCustomerRegisterEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <input type="tel" placeholder="Mobile Number" value={customerRegisterMobileNumber} onChange={(e) => setCustomerRegisterMobileNumber(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <input type="password" placeholder="Password" value={customerRegisterPassword} onChange={(e) => setCustomerRegisterPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <input type="password" placeholder="Confirm Password" value={customerRegisterConfirmPassword} onChange={(e) => setCustomerRegisterConfirmPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            <button aria-label="Register as Customer" type="submit" className="w-full bg-[#33659a] text-white p-2 rounded-md">Register as Customer</button>

                            <p className="text-sm text-center mt-3">
                                Already have an account?{' '}
                                <button aria-label="Sign In here"
                                    type="button"
                                    onClick={() => {
                                        setCustomerAuthMode('login');
                                        setCustomerRegisterName('');
                                        setCustomerRegisterEmail('');
                                        setCustomerRegisterMobileNumber('');
                                        setCustomerRegisterPassword('');
                                        setCustomerRegisterConfirmPassword('');
                                    }}
                                    className="text-[#33659a] hover:underline cursor-pointer"
                                >
                                    Sign In here
                                </button>
                            </p>
                        </form>
                    )}
                </DialogContent>
            </Dialog> */}
            <Toaster />
        </>
    )
}