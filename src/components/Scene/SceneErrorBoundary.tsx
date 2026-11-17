import { Component, type ErrorInfo, type ReactNode } from 'react';

interface SceneErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): SceneErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Failed to render the 3D workshop scene.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Workshop 3D scene error:', error, info);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#120b07] p-6 text-center">
          <div className="wood-walnut wood-panel-shadow max-w-md rounded-2xl border-2 border-[#b9823d] p-6">
            <h2 className="font-display text-xl font-bold text-[#ffd27d]">
              Unable to Load Workshop Scene
            </h2>
            <p className="mt-2 text-sm text-[#e7d4b3]/85">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="wood-plank-active mt-5 rounded-xl border-2 border-[#ffd27d] px-5 py-2 text-sm font-bold text-[#fff8e8] transition hover:brightness-110"
            >
              Reload Workshop
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
