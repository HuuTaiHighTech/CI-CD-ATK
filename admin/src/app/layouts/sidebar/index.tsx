import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '~/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '~/components/ui/tooltip';
import { SIDEBAR_DATA } from '~/constants';
import useAuth from '~/hooks/use-auth';
import Icon from '/icon.png';
import Logo from '~/assets/Logo.png';

function Sidebar({ ...props }: React.ComponentProps<typeof SidebarContainer>) {
  const { hasRole, signOut } = useAuth();
  const { state, isMobile } = useSidebar();

  return (
    <SidebarContainer {...props}>
      <SidebarHeader>
        {!isMobile && state === 'collapsed' ? (
          <div className='flex p-1'>
            <img
              src={Icon}
              alt='Logo'
              className='w-full max-w-20 object-cover shrink-0 mx-auto'
            />
          </div>
        ) : (
          <img src={Logo} alt='Logo' className='object-cover' />
        )}
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_DATA.nav.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items
                  .filter((item) => {
                    if (!item.roles || item.roles.length === 0) {
                      return true;
                    }
                    return hasRole(...item.roles);
                  })
                  .map((item) => {
                    const menuButton = (
                      <SidebarMenuItem key={item.title}>
                        <NavLink to={item.url}>
                          {({ isActive }) => (
                            <SidebarMenuButton isActive={isActive} asChild>
                              <span>
                                <item.icon />
                                {item.title}
                              </span>
                            </SidebarMenuButton>
                          )}
                        </NavLink>
                      </SidebarMenuItem>
                    );

                    return state === 'collapsed' ? (
                      <Tooltip key={item.title}>
                        <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                        <TooltipContent side='right'>
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      menuButton
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='text-red-500 hover:text-red-600 dark:text-red-700 dark:hover:text-red-600 cursor-pointer'
              onClick={signOut}
            >
              <LogOut />
              Đăng xuất
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
