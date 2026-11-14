'use client';

import { Card, CardContent } from "@/components/ui/card";
import { serviceMasterItems } from "@/lib/menu";
import { useRouter } from "next/navigation";

const masterItems = serviceMasterItems;

export default function ServiceHome(){
    const router = useRouter();
    
    return (
        <>
            <div className="py-12 my-10 px-6">
                <h2 className="text-xl font-semibold mb-6">Service Master Setup</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {masterItems.map((item, index) => (
                    <Card
                        key={index}
                        onClick={() => router.push(item.path)}
                        className="cursor-pointer hover:shadow-lg transition duration-300 border border-gray-200"
                    >
                        <CardContent className="p-4 flex gap-4 items-start justify-center">
                        <div>
                            <h3 className="text-md font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </>
    )
}