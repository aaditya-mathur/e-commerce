const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-emerald-400 dot"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      <span className="sr-only">Loading</span>

      <style>{`
        .dot {
          animation: dotWave 1.2s ease-in-out infinite;
        }

        @keyframes dotWave {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;