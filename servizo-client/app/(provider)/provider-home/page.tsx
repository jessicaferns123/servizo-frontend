import Image from 'next/image';

export default function ProviderHomePage() {
    return (
        <div className="w-full flex items-center justify-center bg-gray-100 overflow-hidden m-0 p-0" style={{ height: 'calc(100vh - 18rem)' }}>
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center">
            <Image
            src="/servizo_logo.png"
            alt="Company Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-32 h-auto mb-4"
            />
            <h1 className="text-2xl font-semibold text-gray-800">Welcome to Provider Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your services and bookings with ease.</p>
        </div>
        </div>
    );
}