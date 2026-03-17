export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White background with green border */}
      <rect x="1" y="1" width="30" height="30" rx="3" fill="white" stroke="#2E7D32" strokeWidth="2" />

      {/* QR Finder Pattern — top-left */}
      <rect x="4" y="4" width="8" height="8" fill="#2E7D32" />
      <rect x="5.5" y="5.5" width="5" height="5" fill="white" />
      <rect x="6.5" y="6.5" width="3" height="3" fill="#2E7D32" />

      {/* QR Finder Pattern — top-right */}
      <rect x="20" y="4" width="8" height="8" fill="#2E7D32" />
      <rect x="21.5" y="5.5" width="5" height="5" fill="white" />
      <rect x="22.5" y="6.5" width="3" height="3" fill="#2E7D32" />

      {/* QR Finder Pattern — bottom-left */}
      <rect x="4" y="20" width="8" height="8" fill="#2E7D32" />
      <rect x="5.5" y="21.5" width="5" height="5" fill="white" />
      <rect x="6.5" y="22.5" width="3" height="3" fill="#2E7D32" />

      {/* Green medical cross in center */}
      <rect x="14" y="10" width="4" height="12" rx="0.5" fill="#2E7D32" />
      <rect x="10" y="14" width="12" height="4" rx="0.5" fill="#2E7D32" />

      {/* QR data dots — bottom-right area */}
      <rect x="21" y="21" width="2" height="2" fill="#2E7D32" />
      <rect x="25" y="21" width="2" height="2" fill="#2E7D32" />
      <rect x="21" y="25" width="2" height="2" fill="#2E7D32" />
      <rect x="25" y="25" width="2" height="2" fill="#2E7D32" />
      <rect x="23" y="23" width="2" height="2" fill="#2E7D32" />
    </svg>
  );
}
