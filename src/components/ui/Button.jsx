

/**
 * Reusable Premium UI Button Component.
 * Supports multiple variants, sizes, icon wrappers, and animated click and hover states.
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'text' | 'accent'
  size = 'md',       // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left', // 'left' | 'right'
  onClick,
  type = 'button',
  ...props
}) {
  // Base classes with interactive focus rings and transition dynamics
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  // Variant mappings matching our glossy glassmorphic guidelines
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600/70 to-violet-600/70 hover:from-blue-500/80 hover:to-violet-500/80 text-white border border-white/20 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-[var(--btn-sec-bg)] hover:bg-[var(--btn-sec-hover-bg)] text-[var(--btn-sec-text)] border border-[var(--btn-sec-border)] hover:border-[var(--btn-sec-hover-border)] backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-transparent border border-[var(--btn-out-border)] text-[var(--btn-out-text)] hover:text-[var(--btn-out-hover-text)] hover:bg-[var(--btn-out-hover-bg)] hover:border-[var(--btn-out-hover-border)] hover:-translate-y-0.5 active:translate-y-0',
    text: 'bg-transparent text-[var(--btn-text-text)] hover:text-[var(--btn-text-hover-text)] hover:bg-[var(--btn-text-hover-bg)]',
    accent: 'bg-gradient-to-r from-cyan-500/70 to-emerald-500/70 hover:from-cyan-400/80 hover:to-emerald-400/80 text-white border border-white/20 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0',
  };

  // Size specifications
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs tracking-wider uppercase',
    md: 'px-4.5 py-2 text-sm tracking-wide',
    lg: 'px-6 py-3 text-base tracking-wide',
  };

  // Construct combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </span>
      )}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
export default Button;
