type ButtonOptions = {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] transition-[translate,scale,background-color,box-shadow,color] duration-150 ease-out active:scale-[0.96]";

const sizes = {
  md: "min-h-12 px-6 text-[15px]",
  sm: "min-h-10 px-[18px] text-sm",
};

const variants = {
  primary:
    "bg-green text-white shadow-[0_1px_2px_rgba(9,60,32,0.25),0_10px_24px_rgba(18,161,64,0.16)] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_2px_3px_rgba(9,60,32,0.28),0_14px_28px_rgba(18,161,64,0.22)]",
  secondary:
    "bg-white/70 text-ink shadow-[0_0_0_1px_#cfd9d1,0_1px_2px_rgba(23,46,30,0.05)] hover:-translate-y-px hover:bg-white hover:shadow-[0_0_0_1px_#aebaaf,0_2px_4px_rgba(23,46,30,0.08)]",
};

export function button({ variant = "primary", size = "md" }: ButtonOptions = {}) {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}
