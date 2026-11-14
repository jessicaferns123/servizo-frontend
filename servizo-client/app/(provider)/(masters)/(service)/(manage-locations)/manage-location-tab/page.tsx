import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageCountry from "../manage-country/page";
import ManageCity from "../manage-city/page";
import ManageArea from "../manage-area/page";

export default function ManageLocationTab() {
    return (
        <div className='pt-25 pb-20'>
            <div className="p-6 bg-white">
                <div>
                    <Tabs defaultValue="country" className="w-full">
                        <TabsList className="mb-4 w-full h-12">
                            <TabsTrigger value="country" className='cursor-pointer'>Country</TabsTrigger>
                            <TabsTrigger value="city" className='cursor-pointer'>City</TabsTrigger>
                            <TabsTrigger value="area" className='cursor-pointer'>Area</TabsTrigger>
                        </TabsList>
                        <TabsContent value="country">
                            <ManageCountry />
                        </TabsContent>
                        <TabsContent value="city">
                            <ManageCity />
                        </TabsContent>
                        <TabsContent value="area">
                            <ManageArea />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}