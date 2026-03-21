import ChangePasswordCard from '~/app/pages/settings/components/change-password-card';
import InformationCard from '~/app/pages/settings/components/information-card';

function ProfileTab() {
   return (
      <div className='grid lg:grid-cols-2 gap-2.5'>
         <InformationCard />
         <ChangePasswordCard />
      </div>
   );
}
export default ProfileTab;
