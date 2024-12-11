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

const sidebarItem = (() => {
  return [
    { header: 'Quản lý chung' },
    { title: '🌸 Dashboard', to: '/dashboard' },
    { title: '🤵 User Management', to: '/user-management' },
    { title: '🍷 AccountID Management', to: '/account-id-management' },
    { title: '☕ Pem File Management', to: '/pem-management' },
    { title: '🍯 Server Management', to: '/server-management' },
    { header: 'Chức năng' },
    { title: '☘️ Add domains vào CF', to: '/them-domains-vao-cf' },
    { title: '🪵 Redirect Domain', to: '/redirect-domain' },
    { title: '🌷 Clone WP Site', to: '/clone-site' },
    { title: '💐 Create WP Sites', to: '/tao-multi-wp-site' },
    { title: '🌺 Delete WP Sites', to: '/destroy-wp-site' },
  ];
})();


export default sidebarItem;
