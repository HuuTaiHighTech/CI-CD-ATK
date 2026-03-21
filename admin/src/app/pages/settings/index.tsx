import { Settings, User } from 'lucide-react';
import ProfileTab from '~/app/pages/settings/components/profile-tab';
import SettingsTab from '~/app/pages/settings/components/settings-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

function SettingsPage() {
   return (
      <section>
         <div className='flex flex-col sm:flex-row justify-between items-center gap-3 mb-6'>
            <div>
               <h1 className='text-2xl font-bold text-center sm:text-left mb-2'>
                  Quản lý thông tin
               </h1>
               <p className='text-muted-foreground'>
                  Quản lý thông tin cá nhân của bạn
               </p>
            </div>
         </div>
         <Tabs defaultValue='profile'>
            <TabsList className='w-full'>
               <TabsTrigger value='profile' className='cursor-pointer'>
                  <User /> Thông tin
               </TabsTrigger>
               <TabsTrigger value='settings' className='cursor-pointer'>
                  <Settings /> Cài đặt
               </TabsTrigger>
            </TabsList>
            <TabsContent value='profile'>
               <ProfileTab />
            </TabsContent>
            <TabsContent value='settings'>
               <SettingsTab />
            </TabsContent>
         </Tabs>
      </section>
   );
}

export default SettingsPage;
