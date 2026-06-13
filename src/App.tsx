import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Feedback from './pages/Feedback';
import DataMethods from './pages/DataMethods';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/data-methods" element={<DataMethods />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
