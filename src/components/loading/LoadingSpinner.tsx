import "./LoadingSpinner.css";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* Outer circle */}
      <div className="clock-outer">
        {/* Blue spinner in the gap */}
        <div className="spinner-ring" />
        {/* Inner circle with clock */}
        <div className="clock-inner">
          <div className="hand-hour" />
          <div className="hand-minute" />
          <div className="hand-second" />
        </div>
      </div>
    </div>
  );
}
