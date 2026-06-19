export default function GlassCard({ children, className = "", hover = false, ...props }) {
  return (
    <div 
      className={`glass-card ${hover ? "hoverable" : ""} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}
