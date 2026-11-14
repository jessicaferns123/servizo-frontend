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
import {
    CalendarClock,
    Droplets,
    LayoutGrid,
    ListChecks,
    Scissors,
    Search,
    Sparkles,
    Wrench,
    Zap,
} from 'lucide-react';
//import { useNavigation } from '../context/navigation-context';

type Category = {
    _id: string;
    name: string;
    icon: string;
    categorydescription: string;
};

const techStack = ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v4'];

const steps = [
    {
        number: '01',
        Icon: Search,
        title: 'Browse Categories',
        text: 'Explore service categories to find the kind of help you need.',
    },
    {
        number: '02',
        Icon: ListChecks,
        title: 'Explore Services',
        text: 'Open a category to see the services it includes. This flow is still in progress.',
    },
    {
        number: '03',
        Icon: CalendarClock,
        title: 'Request a Service',
        text: 'Booking and scheduling are planned for a future release. This step shows where they will fit.',
    },
];

function TitleAccent() {
    return (
        <div aria-hidden="true" className='flex items-center gap-[6px] mb-[20px]'>
            <span className='block h-[6px] w-[22px] rounded-full bg-[#F15A29]' />
            <span className='block h-[6px] w-[10px] rounded-full bg-[#FFBD3C]' />
        </div>
    );
}

function HeroIllustration() {
    const badges = [
        { Icon: Sparkles, className: 'top-[6%] left-[8%] bg-white text-[#F15A29]' },
        { Icon: Zap, className: 'top-[12%] right-[6%] bg-[#FFBD3C] text-[#032642]' },
        { Icon: Scissors, className: 'bottom-[14%] left-[2%] bg-[#FFBD3C] text-[#032642]' },
        { Icon: Droplets, className: 'bottom-[6%] right-[12%] bg-white text-[#33659a]' },
    ];

    return (
        <div aria-hidden="true" className='relative mx-auto aspect-square w-full max-w-[460px]'>
            <div className='absolute inset-[10%] rounded-full bg-[#F15A29] opacity-15' />
            <div className='absolute inset-[18%] rounded-full border-2 border-dashed border-[#F15A29] opacity-40' />
            <div className='absolute inset-[26%] flex items-center justify-center rounded-full bg-[#032642] shadow-xl'>
                <Wrench className='h-1/2 w-1/2 text-white' strokeWidth={1.5} />
            </div>
            {badges.map(({ Icon, className }, idx) => (
                <div
                    key={idx}
                    className={`absolute flex h-[18%] w-[18%] items-center justify-center rounded-2xl shadow-lg ${className}`}
                >
                    <Icon className='h-1/2 w-1/2' strokeWidth={1.75} />
                </div>
            ))}
        </div>
    );
}

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

    const hasCategories = Array.isArray(categories) && categories.length > 0;

    return (
        <>
            <div className="pl-[24px] pt-[48px] pr-[24px] pb-[48px] hero-container">
                <div className="mx-auto max-w-7xl px-2 md:px-8">
                    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                        <div className='p-4'>
                            <div>
                                <span className='mb-5 inline-block rounded-full border border-[#F15A29]/30 bg-white px-3 py-1 text-[13px] font-[600] text-[#F15A29]'>
                                    Frontend portfolio project · work in progress
                                </span>
                                <p className='text-[40px] leading-[48px] md:text-[52px] font-[700] md:leading-[61px] text-left mb-5'>Choose Experts to<br /> Get Your &nbsp;
                                    <span className='job-word'>Job</span><br />
                                      Done
                                </p>
                                <p className='text-[18px] font-[400] leading-[30px] text-left'>
                                    Servizo is a marketplace concept for finding local home-service professionals. Browse services by category and explore how the customer and provider experience is designed.
                                </p>
                            </div>
                            <div className='my-10 text-left'>
                                <p className='text-[14px] font-[600] uppercase tracking-[1.2px] text-[#032642]/70 mb-3'>Built with</p>
                                <ul className='flex flex-wrap gap-2'>
                                    {techStack.map((tech) => (
                                        <li key={tech} className='rounded-full bg-white px-4 py-2 text-[15px] font-[600] text-[#032642] shadow-sm'>
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='p-4'>
                            <HeroIllustration />
                        </div>
                    </div>
                </div>
            </div>


            <div className='pt-25 pb-20'>
                <div className="mx-auto max-w-7xl px-8 md:px-8">
                    <div className='flex items-end justify-between mb-15'>
                        <div>
                            <TitleAccent />
                            <p className='relative text-[#FFBD3C] uppercase text-[16px] font-[700] leading-[24px] mb-[7px] tracking-[1.44px] text-left'>Categories</p>
                            <p className='text-[36px] leading-[44px] md:text-[48px] font-[700] md:leading-[56px] mb-[7px]'>Popular Categories</p>
                        </div>
                    </div>

                    {loading && (
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4' aria-busy="true" aria-label="Loading categories">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className='h-[230px] animate-pulse rounded-[24px] border border-[#F5E4DF] bg-[#fdf6f4]' />
                            ))}
                        </div>
                    )}

                    {!loading && !hasCategories && (
                        <div className='flex flex-col items-center rounded-[24px] border-2 border-dashed border-[#F5E4DF] bg-[#fffaf9] px-6 py-14 text-center'>
                            <div className='mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#F15A29]/10 text-[#F15A29]'>
                                <LayoutGrid className='h-9 w-9' strokeWidth={1.75} />
                            </div>
                            <p className='text-[22px] font-[700] leading-[30px] text-[#032642] mb-2'>No categories to show yet</p>
                            <p className='max-w-[520px] text-[16px] leading-[26px] text-gray-600'>
                                Service categories are loaded from the Servizo API, which is kept private for now.
                                They will appear here once the API is connected.
                            </p>
                        </div>
                    )}

                    {!loading && hasCategories && (
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
                                            <img src={cat.icon} alt={cat.name} className='w-auto h-full'/>
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
                    )}
                </div>
            </div>



            <div className="bg-white py-8 overflow-hidden">
                <div className="mx-auto max-w-7xl px-8 pt-[80px] pb-[80px] sm:px-6 md:px-8 relative rounded-[24px] z-1 service-section">
                    <div className='mb-10 text-center'>
                        <p className='text-[#FFBD3C] uppercase text-[16px] font-[700] leading-[24px] mb-[7px] tracking-[1.44px]'>How It Works</p>
                        <p className='text-white font-[700] text-[30px] leading-[40px]'>Convenient Service Access</p>
                        <p className='text-[#F4FAFF] text-[18px] leading-[32px] max-w-[600px] mx-auto'>A simple three-step flow designed to connect customers with local service professionals.</p>
                    </div>
                    <div className='relative'>
                        <div aria-hidden="true" className='absolute top-[117px] left-[16%] right-[16%] z-[-1] hidden border-t-2 border-dashed border-[#5A6F80] md:block' />
                        <div className='grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-4'>
                            {steps.map(({ number, Icon, title, text }) => (
                                <div key={number} className='text-center service-col-container'>
                                    <div>
                                        <p className='relative text-[50px] mb-[-18px] z-[-1] service-col-header'>{number}</p>
                                    </div>
                                    <div className='w-[130px] h-[130px] rounded-full border border-[#F15A29] mx-auto flex items-center justify-center service-icon'>
                                        <Icon aria-hidden="true" className='h-[52px] w-[52px] text-white' strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className='text-white text-[20px] font-[600] leading-[32px] mt-[23px] mb-[10px]'>{title}</p>
                                        <p className='max-w-[337px] w-full text-[#F4FAFF] mx-auto text-[16px]'>{text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
