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
  if (!(user && user.roleId)) return [];

  switch (user.roleId) {
    case 'admin':
      return [
        { header: 'Quản lý chung' },
        {
          title: 'Dashboard',
          icon: DashboardOutlined,
          to: '/dashboard'
        },
        {
          title: 'User Management',
          icon: UserOutlined,
          to: '/user-management'
        },
        { header: 'Chức năng' },
        {
          title: 'Thêm domains vào CF',
          icon: ProfileOutlined,
          to: '/them-domains-vao-cf'
        },
        {
          title: 'Redirect Domain',
          icon: CrownOutlined,
          to: '/redirect-domain'
        },
        {
          title: 'Clone WP Site',
          icon: FontSizeOutlined,
          to: '/whiltelist-ip'
        },
        {
          title: 'Tạo Multi WP Site',
          icon: BarcodeOutlined,
          to: '/tao-multi-wp-site'
        },
        
      ];
      break;
    case 'seo-3':
      return [
        { header: 'Quản lý chung' },
        {
          title: 'Dashboard',
          icon: DashboardOutlined,
          to: '/dashboard'
        },

        { header: 'Chức năng' },
        {
          title: 'Thêm domains vào CF',
          icon: ProfileOutlined,
          to: '/them-domains-vao-cf'
        },
        {
          title: 'Redirect Domain',
          icon: CrownOutlined,
          to: '/redirect-domain'
        },
        {
          title: 'Clone WP Site',
          icon: FontSizeOutlined,
          to: '/clone-site'
        },
        {
          title: 'Tạo Multi WP Site',
          icon: BarcodeOutlined,
          to: '/tao-multi-wp-site'
        },
        
      ];
      break;

    case '2':
      return [
        { header: 'Quản lý chung' },
        {
          title: 'Dashboard',
          icon: DashboardOutlined,
          to: '/dashboard'
        },
        { header: 'Chức năng' },
        
      ];
      break;
  }
})();


export default sidebarItemRole;
