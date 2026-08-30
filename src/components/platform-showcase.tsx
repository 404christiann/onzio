export function PlatformShowcase() {
  return (
    <div
      className="browser-frame"
      role="region"
      aria-label="Diverse City FC public website"
    >
      <div className="browser-toolbar" aria-hidden="true">
        <div className="browser-dots"><span /><span /><span /></div>
        <div className="browser-address">
          <svg viewBox="0 0 16 16" width="12" height="12"><rect x="3" y="7" width="10" height="7" rx="2"/><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"/></svg>
          diversecityfc.com
        </div>
        <div className="browser-toolbar-actions"><span /><span /></div>
      </div>
      <iframe
        src="https://diversecityfc.com/"
        title="Interactive preview of the Diverse City FC public website"
        loading="lazy"
      />
    </div>
  );
}
