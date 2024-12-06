// icons
import {
  DashboardOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  CrownOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { jwtDecode } from 'jwt-decode';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItemRole = (() => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return [];
  const parsedUser = JSON.parse(storedUser);
  if (!(parsedUser && parsedUser.user && parsedUser.user.token)) return [];
  const user = jwtDecode(parsedUser.user.token);
  const userRole = (user as any).roleId;
  if (!(user && userRole)) return [];
  
  switch (true) {
    case ['admin'].includes(userRole):
      return [
        { 
          header: 'Quản lý chung',
         },
        {
          title: '🌸 Dashboard',
          to: '/dashboard',
        },
        {
          title: '🤵 User Management',
          to: '/user-management',
        },
        {
          title: '🍷 AccountID Management',
          to: '/account-id-management',
        },
        {
          title: '☕ Pem File Management',
          to: '/pem-management',
        },
        {
          title: '🍯 Server Management',
          to: '/server-management',
        },
        { 
          header: 'Chức năng',
        },
        {
          title: '☘️ Add domains vào CF',
          to: '/them-domains-vao-cf',
        },
        {
          title: '🪵 Redirect Domain',
          to: '/redirect-domain',
        },
        {
          title: '🌷 Clone WP Site',
          to: '/clone-site',
        },
        {
          title: '💐 Create WP Sites',
          to: '/tao-multi-wp-site',
        },
        {
          title: '🌺 Delete WP Sites',
          to: '/destroy-site',
        },
      ];
      break;
    case ['seo-1', 'seo-2', 'seo-3', 'seo-4', 'seo-5', 'seo-6'].includes(userRole):
      return [
        { header: 'Quản lý chung',
         },
        {
          title: '🌸 Dashboard',
          to: '/dashboard',
        },

        { 
          header: 'Chức năng',
         },
        {
          title: '☘️ Thêm domains vào CF',
          to: '/them-domains-vao-cf',
        },
        {
          title: '🪵 Redirect Domain',
          to: '/redirect-domain',
        },
        {
          title: '🌷 Clone WP Site',
          to: '/clone-site',
        },
        {
          title: '💐 Create WP Sites',
          to: '/tao-multi-wp-site',
        },
        {
          title: '🌺 Delete WP Sites',
          to: '/destroy-wp-site',
        },
      ];
      break;
  }
})();


export default sidebarItemRole;
