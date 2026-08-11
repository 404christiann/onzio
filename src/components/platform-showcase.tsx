export function PlatformShowcase() {
  return (
    <div
      className="mx-auto w-full max-w-[1100px] transform-gpu overflow-hidden rounded-[13px] bg-[#0c1710] shadow-[0_0_0_1px_rgba(12,23,16,0.16),0_35px_85px_rgba(27,49,33,0.16)] sm:rounded-[20px]"
      role="region"
      aria-label="Deportivo Olimpico public website"
    >
      <div className="grid h-[41px] grid-cols-[1fr_minmax(170px,65%)_1fr] items-center gap-3 bg-[#e9edea] px-3 sm:h-[50px] sm:grid-cols-[1fr_minmax(230px,420px)_1fr] sm:px-[17px]" aria-hidden="true">
        <div className="flex items-center gap-1 sm:gap-[7px]">
          <span className="size-1.5 rounded-full bg-[#bcc5be] sm:size-[9px]" />
          <span className="size-1.5 rounded-full bg-[#bcc5be] sm:size-[9px]" />
          <span className="size-1.5 rounded-full bg-[#bcc5be] sm:size-[9px]" />
        </div>
        <div className="flex h-[23px] items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[7px] bg-white text-[8px] text-[#77827a] shadow-[0_0_0_1px_#dce2dd] sm:h-7 sm:text-[10px]">
          <svg className="fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.3]" viewBox="0 0 16 16" width="12" height="12"><rect x="3" y="7" width="10" height="7" rx="2"/><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"/></svg>
          deportivo-olimpico.vercel.app
        </div>
        <div className="hidden items-center justify-end gap-[7px] sm:flex">
          <span className="size-[15px] rounded border border-[#c2cac4]" />
          <span className="size-[15px] rounded border border-[#c2cac4]" />
        </div>
      </div>
      <iframe
        className="block h-[74vh] min-h-[520px] w-full border-0 bg-[#0c1710] sm:h-[min(620px,56vw)]"
        src="https://deportivo-olimpico.vercel.app/"
        title="Interactive preview of the Deportivo Olimpico public website"
        loading="lazy"
      />
    </div>
  );
}
