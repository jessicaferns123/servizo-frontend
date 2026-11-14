'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
//import { useNavigation } from '../context/navigation-context';

type Category = {
    _id: string;
    name: string;
    icon: string;
    categorydescription: string;
};

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [services, setServices] = useState<string[]>([]);

    const router = useRouter();
    //const { startNavigation } = useNavigation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/global/getAllActiveServiceCategories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data['Result']);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleNavigation = (service: any) => {
        localStorage.setItem('selectedService', JSON.stringify(service));
        const serviceSlug = encodeURIComponent(service.servicename.toLowerCase().replace(/\s+/g, '-'));
        router.push(`/services/${serviceSlug}`);
    };

    const fetchServicesByCategory = async (categoryId: number) => {
        try {
            const response = await fetch('http://localhost:3000/global/getServicesByCategoryId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryid: categoryId }),
            });

            if (!response.ok) throw new Error('Failed to fetch services');

            const data = await response.json();
            setServices(data['Result']);
        } catch (err: any) {
            console.error('Error fetching services:', err.message);
        }
    };

    return (
        <>
            <div className="pl-[24px] pt-[48px] pr-[24px] pb-[48px] hero-container">
                <div className="mx-auto max-w-7xl px-8 md:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className='p-4'>
                            <div>
                                <p className='text-[52px] font-[700] leading-[61px] text-left mb-5'>Choose Experts to<br /> Get Your &nbsp; 
                                    <span className='job-word'>
                                        Job
                                        <img className='job-word-shape' src='/banner-title-shape.png'/>
                                    </span><br />
                                      Done
                                </p>
                                <p className='text-[18px] font-[400] leading-[30px] text-left'>
                                    Explore our marketplace to find top-rated professionals in your area. Compare reviews, check availability, and book services with confidence—all in one place.
                                </p>
                            </div>
                            <div className='flex items-center gap-[5px] my-10'>
                                <div>
                                    <ul className='flex items-center'>
                                        <li>
                                            <img src='/customer-1.png' className='w-full h-full'/>
                                        </li>
                                        <li className='ml-[-13px]'>
                                            <img src='/customer-2.png' className='w-full h-full'/>
                                        </li>
                                        <li className='ml-[-13px]'>
                                            <img src='/customer-3.png' className='w-full h-full'/>
                                        </li>
                                        <li className='ml-[-13px]'>
                                            <img src='/customer-4.png' className='w-full h-full'/>
                                        </li>
                                    </ul>
                                </div>
                                <div className='text-left'>
                                    <p className='text-[22px] font-[700] leading-[30px]'>
                                        <span className='customer-count'>2k+</span> Customers
                                    </p>
                                    <p className='text-[18px] leading-[30px]'>Satisfied with Servizo services</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <img src='/hero-img.png'/>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className='pt-25 pb-20'>
                <div className="mx-auto max-w-7xl px-8 md:px-8">
                    <div className='flex items-end justify-between mb-15'>
                        <div>
                            <img src='/title-shape-1.png' className='w-[34px] h-[25px] mb-[20px]'/>
                            <p className='relative text-[#FFBD3C] uppercase text-[16px] font-[700] leading-[24px] mb-[7px] tracking-[1.44px] text-left'>Categories</p>
                            <p className='text-[48px] font-[700] leading-[56px] mb-[7px]'>Popular Categories</p>
                        </div>
                        <a></a>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {
                        categories.map((cat, index) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <div onClick={() => {
                                        setSelectedCategory(cat);
                                        //fetchServicesByCategory(cat.categoryid); // Call your new API
                                    }} className='cursor-pointer relative w-full pt-[32px] pb-[24px] px-0 text-center rounded-[24px] border border-[#F5E4DF] mb-[30px] tile-body'>
                                        <div className='w-[140px] h-[140px] mx-auto'>
                                            <img src={cat.icon} className='w-auto h-full'/>
                                        </div>
                                        <div className='px-2'>
                                            <p className='text-[20px] font-[500] leading-[30px] mt-[16px] mb-[4px] tile-title'>{cat.name}</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-6 rounded-2xl shadow-lg bg-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-[#33659a]">{selectedCategory?.name}</DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500 mt-1 mb-4">
                                            {selectedCategory?.categorydescription}
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="max-h-[300px] overflow-y-auto custom-scroll">
                                        <ul className="space-y-3">
                                            {services.map((service:any, idx:number) => (
                                                <li key={service._id} onClick={() => handleNavigation(service)} className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-[#f5faff] hover:border-[#33659a] hover:text-[#33659a] cursor-pointer transition-all duration-200">
                                                    <span className="text-[16px] font-medium">{service.servicename}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))
                    }
                    </div>
                </div>
            </div>

        

            <div className="bg-white py-8 overflow-hidden">
                <div className="mx-auto max-w-7xl px-8 pt-[80px] pb-[80px] sm:px-6 md:px-8 relative rounded-[24px] z-1 service-section">
                    <div className='mb-10 text-center'>
                        <p className='text-[#FFBD3C] uppercase text-[16px] font-[700] leading-[24px] mb-[7px] tracking-[1.44px]'>How It Works</p>
                        <p className='text-white font-[700] text-[30px] leading-[40px]'>Convinient Service Access</p>
                        <p className='text-[#F4FAFF] text-[18px] leading-[32px] max-w-[600px] mx-auto'>Launch your online presence with ease! Access various services at your convinience with easy steps on our website.</p>
                    </div>
                    <div className='relative'>
                        <div className='absolute top-[25%] left-[20%] w-full z-[-1]'>
                            <img src='/arrow-line.png'/>
                        </div>
                        <div className='grid grid-cols-3 gap-4'>
                            <div className='text-center service-col-container'>
                                <div>
                                    <p className='relative text-[50px] mb-[-18px] z-[-1] service-col-header'>01</p>
                                </div>
                                <div className='w-[130px] h-[130px] rounded-full border border-[#F15A29] mx-auto flex items-center justify-center service-icon'>
                                    <img src='/service-01.png' className='inline-block max-w-full h-auto'/>
                                </div>
                                <div>
                                    <p className='text-white text-[20px] font-[600] leading-[32px] mt-[23px] mb-[10px]'>Choose Your Service</p>
                                    <p className='max-w-[337px] w-full text-[#F4FAFF] mx-auto text-[16px]'>Pick the service that your looking for on our website</p>
                                </div>
                            </div>
                            <div className='text-center service-col-container'>
                                <div>
                                    <p className='relative text-[50px] mb-[-18px] z-[-1] service-col-header'>02</p>
                                </div>
                                <div className='w-[130px] h-[130px] rounded-full border border-[#F15A29] mx-auto flex items-center justify-center service-icon'>
                                    <img src='/service-02.png' className='inline-block max-w-full h-auto'/>
                                </div>
                                <div>
                                    <p className='text-white text-[20px] font-[600] leading-[32px] mt-[23px] mb-[10px]'>Pick Your Schedule</p>
                                    <p className='max-w-[337px] w-full text-[#F4FAFF] mx-auto text-[16px]'>Pick the schedule that suits you well as per your convinience</p>
                                </div>
                            </div>
                            <div className='text-center service-col-container'>
                                <div>
                                    <p className='relative text-[50px] mb-[-18px] z-[-1] service-col-header'>03</p>
                                </div>
                                <div className='w-[130px] h-[130px] rounded-full border border-[#F15A29] mx-auto flex items-center justify-center service-icon'>
                                    <img src='/service-03.png' className='inline-block max-w-full h-auto'/>
                                </div>
                                <div>
                                    <p className='text-white text-[20px] font-[600] leading-[32px] mt-[23px] mb-[10px]'>Place The Order</p>
                                    <p className='max-w-[337px] w-full text-[#F4FAFF] mx-auto text-[16px]'>Place an order for the service you wish to book with us</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
