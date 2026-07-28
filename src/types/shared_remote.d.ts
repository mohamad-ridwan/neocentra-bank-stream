declare module 'shared_remote/store' {
  export const store: any;
  export const logout: any;
  export const toggleTheme: any;
  export const loginSuccess: any;
  export type RootState = any;
  export type AppDispatch = any;
}

declare module 'shared_remote/Button' {
  import React from 'react';
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }
  export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module 'shared_remote/Input' {
  import React from 'react';
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
  }
  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
}

declare module 'shared_remote/apiHelper' {
  import { QueryClient } from '@tanstack/react-query';
  export const queryClient: QueryClient;
  export function apiFetch<T>(path: string, options?: RequestInit): Promise<T>;
}

declare module 'shared_remote/AuthWrapper' {
  import React from 'react';
  export interface AuthWrapperProps {
    children: React.ReactNode;
  }
  export const AuthWrapper: React.ComponentType<AuthWrapperProps>;
  export default AuthWrapper;
}

declare module 'shared_remote/Tooltip' {
  import React from 'react';
  export const Tooltip: React.ComponentType<any>;
  export const TooltipTrigger: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
}

declare module 'shared_remote/DropdownMenu' {
  import React from 'react';
  export const DropdownMenu: React.ComponentType<any>;
  export const DropdownMenuTrigger: React.ComponentType<any>;
  export const DropdownMenuContent: React.ComponentType<any>;
  export const DropdownMenuItem: React.ComponentType<any>;
  export const DropdownMenuCheckboxItem: React.ComponentType<any>;
  export const DropdownMenuRadioItem: React.ComponentType<any>;
  export const DropdownMenuLabel: React.ComponentType<any>;
  export const DropdownMenuSeparator: React.ComponentType<any>;
  export const DropdownMenuShortcut: React.ComponentType<any>;
  export const DropdownMenuGroup: React.ComponentType<any>;
  export const DropdownMenuPortal: React.ComponentType<any>;
  export const DropdownMenuSub: React.ComponentType<any>;
  export const DropdownMenuSubContent: React.ComponentType<any>;
  export const DropdownMenuSubTrigger: React.ComponentType<any>;
  export const DropdownMenuRadioGroup: React.ComponentType<any>;
}

declare module 'shared_remote/useRemoteCSS' {
  export function useRemoteCSS(
    remoteBaseUrl: string,
    remoteName: string,
    exposedModule: string,
  ): { loaded: boolean; error: Error | null };
}

declare module 'shared_remote/federatedStats' {
  import type { NextApiHandler } from 'next';
  const handler: NextApiHandler;
  export default handler;
}

declare module "shared_remote/Skeleton" {
  import React from "react";
  export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const Skeleton: React.ComponentType<SkeletonProps>;
}

declare module 'shared_remote/Dialog' {
  import React from 'react';
  export const Dialog: React.ComponentType<any>;
  export const DialogTrigger: React.ComponentType<any>;
  export const DialogContent: React.ComponentType<any>;
  export const DialogHeader: React.ComponentType<any>;
  export const DialogFooter: React.ComponentType<any>;
  export const DialogTitle: React.ComponentType<any>;
  export const DialogDescription: React.ComponentType<any>;
  export const DialogClose: React.ComponentType<any>;
  export const DialogPortal: React.ComponentType<any>;
  export const DialogOverlay: React.ComponentType<any>;
}

declare module 'shared_remote/Toast' {
  import React from 'react';
  export const Toaster: React.ComponentType<any>;
  export const toast: any;
}

declare module 'shared_remote/imageGallery' {
  import React from 'react';
  export interface ImageGalleryProps {
    images: string[];
    onClose?: () => void;
  }
  export const ImageGallery: React.ComponentType<ImageGalleryProps>;
  export default ImageGallery;
}
