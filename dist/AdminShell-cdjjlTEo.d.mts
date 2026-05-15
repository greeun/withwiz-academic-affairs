import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface NavItem {
    href: string;
    label: string;
    shortLabel: string;
    icon?: ReactNode;
    group?: string;
}
interface AdminShellConfig {
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

interface Props {
    config: AdminShellConfig;
    children: React.ReactNode;
}
declare function AdminShell({ config, children }: Props): react_jsx_runtime.JSX.Element;

export { AdminShell as A, type NavItem as N, type AdminShellConfig as a };
