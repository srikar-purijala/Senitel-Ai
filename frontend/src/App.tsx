import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import { ErrorBoundary } from './ErrorBoundary';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NetworkExplorer from './pages/NetworkExplorer';
import About from './pages/About';
import Analytics from './pages/Analytics';
import Investigations from './pages/Investigations';
import Entities from './pages/Entities';
import Audit from './pages/Audit';
import Settings from './pages/Settings';
import RazorpayPortal from './pages/RazorpayPortal';
import Networks from './pages/Networks';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
              <Route path="/command-center" element={<Dashboard />} />
              <Route path="/network/:id" element={<NetworkExplorer />} />
              <Route path="/networks" element={<Networks />} />
              <Route path="/investigations" element={<Investigations />} />
              <Route path="/entities" element={<Entities />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/razorpay" element={<RazorpayPortal />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
