export function PlatformShowcase() {
  return (
    <>
      <div
        className="browser-frame"
        role="region"
        aria-label="Deportivo Olimpico public website concept"
      >
        <div className="browser-toolbar" aria-hidden="true">
          <div className="browser-dots"><span /><span /><span /></div>
          <div className="browser-address">deportivo-olimpico.vercel.app</div>
          <div className="browser-spacer" />
        </div>
        <iframe
          src="https://deportivo-olimpico.vercel.app/"
          title="Interactive preview of the Deportivo Olimpico public website"
          loading="lazy"
        />
      </div>

      <div className="case-caption">
        <p><strong>A club-first digital home</strong> shaped around local identity and ambition.</p>
        <p>Guadalupe, California</p>
      </div>
    </>
  );
}
