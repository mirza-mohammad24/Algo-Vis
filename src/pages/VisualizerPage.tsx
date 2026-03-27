import { Visualizer } from '../features/visualizer/Visualizer';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';

export function VisualizerPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <ErrorBoundary>
        <Visualizer />
      </ErrorBoundary>
    </div>
  );
}
