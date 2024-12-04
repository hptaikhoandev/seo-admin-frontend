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

  switch (true) {
    case ['admin'].includes(user.roleId):
      return [
        { header: 'Quản lý chung' },
        {
          title: '🌸 Dashboard',
          // icon: DashboardOutlined,
          to: '/dashboard'
        },
        {
          title: '🤵 User Management',
          // icon: UserOutlined,
          to: '/user-management'
        },
        {
          title: '🍷 AccountID Management',
          // icon: UserOutlined,
          to: '/account-id-management'
        },
        {
          title: '☕ Pem File Management',
          // icon: UserOutlined,
          to: '/pem-management'
        },
        {
          title: '🍯 Server Management',
          // icon: UserOutlined,
          to: '/server-management'
        },
        { header: 'Chức năng' },
        {
          title: '☘️ Thêm domains vào CloudFlare',
          // icon: ProfileOutlined,
          to: '/them-domains-vao-cf'
        },
        {
          title: '🪵 Redirect Domain',
          // icon: CrownOutlined,
          to: '/redirect-domain'
        },
        {
          title: '🌷 Clone WP Site',
          // icon: FontSizeOutlined,
          to: '/clone-site'
        },
        {
          title: '💐 Create WP Sites',
          // icon: BarcodeOutlined,
          to: '/tao-multi-wp-site'
        },
        {
          title: '🌺 Delete WP Sites',
          // icon: FontSizeOutlined,
          to: '/destroy-site',
        },
      ];
      break;
    case ['seo-1', 'seo-2', 'seo-3', 'seo-4', 'seo-5', 'seo-6'].includes(user.roleId):
      return [
        { header: 'Quản lý chung' },
        {
          title: '🌸 Dashboard',
          // icon: DashboardOutlined,
          to: '/dashboard'
        },

        { header: 'Chức năng' },
        {
          title: '☘️ Thêm domains vào CF',
          // icon: ProfileOutlined,
          to: '/them-domains-vao-cf'
        },
        {
          title: '🪵 Redirect Domain',
          // icon: CrownOutlined,
          to: '/redirect-domain'
        },
        {
          title: '🌷 Clone WP Site',
          // icon: FontSizeOutlined,
          to: '/clone-site'
        },
        {
          title: '💐 Create WP Sites',
          // icon: BarcodeOutlined,
          to: '/tao-multi-wp-site'
        },
        {
          title: '🌺 Delete WP Sites',
          // icon: FontSizeOutlined,
          to: '/destroy-wp-site',
        },
      ];
      break;
  }
})();


export default sidebarItemRole;
