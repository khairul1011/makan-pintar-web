export default function Switch({ isOn, onToggle, ariaLabel }) {
  return (
    <button
      type="button"
      className={`switch ${isOn ? "on" : ""}`}
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-checked={isOn}
      role="switch"
    />
  );
}
