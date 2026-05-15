import type { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon?: ReactNode;
  group?: string;
}

export interface AdminShellConfig {
  brand: {
    name: string;
    shortName?: string;
    homeUrl: string;
  };
  auth: {
    meEndpoint: string;
    logoutEndpoint: string;
    loginPath: string;
  };
  navigation: NavItem[];
  theme?: {
    accentColor?: string;
  };
}
