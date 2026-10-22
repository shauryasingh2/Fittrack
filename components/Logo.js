export default function Logo({ size = 32 }) {
  return (
    <span className="inline-flex items-center gap-2 text-xl font-bold tracking-tight">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a55f5" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
        <rect width="32" height="32" rx="9" fill="url(#g)" />
        <path d="M6 17h4l3-8 5 14 3-6h5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      FitTrack
    </span>
  );
}
