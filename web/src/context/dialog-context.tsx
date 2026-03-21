'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Type = 'success' | 'error' | 'warning' | 'info';

interface Options {
  title: string;
  text?: string;
  type?: Type;
}

interface State extends Options {
  open: boolean;
  resolve?: (value: boolean) => void;
}

type Context = {
  alert: (options: Options) => Promise<void>;
  confirm: (options: Options) => Promise<boolean>;
  dialog: State;
};

const DialogContext = createContext<Context | null>(null);

function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<State>({
    open: false,
    title: ''
  });

  const alert = (options: Options) =>
    new Promise<void>((resolve) => {
      setDialog({
        ...options,
        open: true,
        resolve: () => {
          resolve();
          setDialog((d) => ({ ...d, open: false }));
        }
      });
    });

  const confirm = (options: Options) =>
    new Promise<boolean>((resolve) => {
      setDialog({
        ...options,
        open: true,
        resolve: (value: boolean) => {
          resolve(value);
          setDialog((d) => ({ ...d, open: false }));
        }
      });
    });

  return (
    <DialogContext.Provider value={{ dialog, alert, confirm }}>
      {children}
    </DialogContext.Provider>
  );
}

export default DialogProvider;

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }

  return context;
};
