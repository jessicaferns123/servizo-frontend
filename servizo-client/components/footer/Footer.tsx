import { useRouter } from "next/navigation";
import Logo from "../shared/Logo";

// Pages that have not been built yet. Rendered as disabled text, not links.
const comingSoon = (label: string) => (
    <span aria-disabled="true" className="cursor-default text-gray-500">
        {label} <span className="text-[12px] text-gray-400">(coming soon)</span>
    </span>
);

export default function Footer() {
    const router = useRouter();

    return (
        <>
        <div className="footer-body">
                <div className='mx-auto max-w-7xl px-8 pb-8 sm:px-6 md:px-8'>
                    <div className='flex flex-col md:flex-row items-center justify-between  border-b-1 border-b-[#F5E4DF] py-7 gap-4'>
                        <div>
                            <Logo />
                        </div>
                        <p className='text-[14px] text-gray-600'>
                            A home-services marketplace concept · frontend work in progress
                        </p>
                    </div>
                    <div className='py-7 extra-links'>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-left'>
                            <div>
                                <p className='text-[18px] font-[600]'>Company</p>
                                <ul>
                                    <li>{comingSoon('About Us')}</li>
                                    <li>{comingSoon('Terms & Conditions')}</li>
                                    <li>{comingSoon('Privacy Policy')}</li>
                                </ul>
                            </div>
                            <div>
                                <p className='text-[18px] font-[600]'>For Customers</p>
                                <ul>
                                    <li>{comingSoon('Contact Us')}</li>
                                </ul>
                            </div>
                            <div>
                                <p className='text-[18px] font-[600]'>For Partners</p>
                                <ul>
                                    <li>
                                        <a className="cursor-pointer" onClick={() => router.push('/provider-register')}>Register as a professional</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='footer-copyright py-2'>
                    <div className='mx-auto max-w-7xl px-8 sm:px-6 md:px-8'>
                        <p className='text-left text-[14px]'>© Copyright 2026 Servizo. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
