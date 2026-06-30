import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Toast from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);
export const useGlobalToast = () => useContext(ToastContext);

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export default function AppLayout({ title, subtitle, children }) {
  const toastApi = useToast();

  return (
    <ToastContext.Provider value={toastApi}>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Header title={title} subtitle={subtitle} />
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ flex: 1 }}
          >
            {children}
          </motion.div>
        </div>
        <Toast toasts={toastApi.toasts} dismiss={toastApi.dismiss} />
      </div>
    </ToastContext.Provider>
  );
}
