'use client';

import { toast, Toaster } from 'sonner';

export { Toaster };
export const toastApi = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast(msg),
  warning: (msg: string) => toast.warning(msg),
};
