import React from 'react';

const Spinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeMap = {
    sm: '1.5rem',
    md: '3rem',
    lg: '4.5rem',
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 fade-in">
      <div className="position-relative d-flex align-items-center justify-content-center">
        {/* Glowing Pulse Ring */}
        <div
          className="position-absolute rounded-circle border border-info border-2"
          style={{
            width: `calc(${spinnerSize} + 15px)`,
            height: `calc(${spinnerSize} + 15px)`,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.6,
          }}
        ></div>
        {/* Core Spinner */}
        <div
          className="spinner-border text-info"
          role="status"
          style={{ width: spinnerSize, height: spinnerSize, borderWidth: '3px' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        {/* Doctor Icon inside spinner if large */}
        {size === 'lg' && (
          <i
            className="bi bi-heart-pulse position-absolute text-info"
            style={{ fontSize: '1.8rem', animation: 'pulse 1.5s ease-in-out infinite' }}
          ></i>
        )}
      </div>
      {message && (
        <p className="mt-3 text-info fw-500 small tracking-wider text-uppercase">
          {message}
        </p>
      )}

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .tracking-wider {
          letter-spacing: 0.15em;
        }
        .fw-500 {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Spinner;
