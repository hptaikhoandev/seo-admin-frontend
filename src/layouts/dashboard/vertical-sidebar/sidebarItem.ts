// icons
import {
  DashboardOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  CrownOutlined
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
    case '1':
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
          title: 'Thay đổi Name Server',
          icon: BgColorsOutlined,
          to: '/thay-doi-name-server'
        },
        {
          title: 'Redirect Domain',
          icon: CrownOutlined,
          to: '/redirect-domain'
        },
        {
          title: 'Whiltelist IP',
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
