export default function GlassPill({ children, className = "", as = "div", ...props }) {
  const Component = as;
  return (
    <Component className={`glass-pill ${className}`} {...props}>
      {children}
    </Component>
  );
}
