/**
 * @file App.tsx
 *
 * @description
 * The root component of the application.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ErrorBoundary } from './components/layout/ErrorBoundary.tsx';
import { Home } from './pages/Home.tsx';
import { VisualizerPage } from './pages/VisualizerPage.tsx';
import { RacePage } from './pages/RacePage.tsx';

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route
            path="/race"
            element={
              <ErrorBoundary>
                <RacePage />
              </ErrorBoundary>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;