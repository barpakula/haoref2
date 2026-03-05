export function Header() {
  return (
    <header className="bg-wolt-dark text-white px-5 py-3.5 flex items-center justify-between relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-wolt-blue/10 to-transparent pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        {/* Logo mark — stylized rocket in a rounded square */}
        <div className="w-10 h-10 bg-wolt-blue rounded-xl flex items-center justify-center shadow-lg shadow-wolt-blue/20">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-lg leading-tight tracking-tight">HaOref Eats</h1>
          <p className="text-[11px] text-wolt-blue font-medium -mt-0.5">
            {"\u{1F4E6}"} משלוח טילים עד הבית
          </p>
        </div>
      </div>

      {/* Status dot */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-wolt-green animate-pulse" />
          <span className="text-xs font-medium text-white/80">Live</span>
        </div>
      </div>
    </header>
  );
}
