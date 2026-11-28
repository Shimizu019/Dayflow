import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDayflowStore } from '@/store/useDayflowStore';
import CenteredModal from '@/components/modals/CenteredModal';
import router from './router';

const App: React.FC = () => {
  const theme = useDayflowStore((state) => state.theme);
  const loadFromDatabase = useDayflowStore((state) => state.loadFromDatabase);

  useEffect(() => {
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-mode');
      document.documentElement.style.colorScheme = 'light';
    }
    document.documentElement.style.setProperty('--app-background', theme.mode === 'dark' ? '#11101A' : '#F8F7FC');
    document.documentElement.style.setProperty('--surface-background', theme.mode === 'dark' ? '#1D1A29' : '#FFFFFF');
    document.documentElement.style.setProperty('--app-text', theme.mode === 'dark' ? '#F4F1FE' : '#191627');
    document.documentElement.style.setProperty('--app-muted', theme.mode === 'dark' ? '#B7B1C9' : '#7B768F');
    document.documentElement.style.setProperty('--app-border', theme.mode === 'dark' ? '#373247' : '#ECE8FA');
    document.documentElement.style.setProperty('--app-soft-surface', theme.mode === 'dark' ? '#292538' : '#F4F1FE');
    document.documentElement.style.setProperty('--app-soft-border', theme.mode === 'dark' ? '#39334D' : '#EAE4FC');
  }, [theme.mode]);

  useEffect(() => {
    let mounted = true;
    const initDb = async () => {
      try {
        await loadFromDatabase();
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        if (mounted) {
          // dbReady is no longer used; App always renders
        }
      }
    };
    initDb();
    return () => { mounted = false; };
  }, [loadFromDatabase]);

  return (
    <>
      <RouterProvider router={router} />
      <CenteredModal />
    </>
  );
};

export default App;
