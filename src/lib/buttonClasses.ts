// Liquid glass, after the owner's reference: buttons share one smoky glass capsule,
// and the main action is a raised inner glass pill with a specular highlight and a
// blue and warm fringe along its edges, like light bending through a lens.
// Class names are written out in full because Tailwind only generates classes it finds as literals.

// The capsule that holds a row of buttons.
export const glassBar =
  "flex w-max items-center gap-1 rounded-full border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.12))] p-1.5 backdrop-blur-2xl backdrop-brightness-[0.82] backdrop-saturate-[1.6] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.12),inset_0_0_24px_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.3)]";

const segment =
  "flex items-center justify-center rounded-full border py-[0.8em] text-[clamp(10px,0.8vw,14px)] leading-none font-bold tracking-[0.14em] whitespace-nowrap uppercase [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] transition duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-disabled:cursor-not-allowed aria-disabled:opacity-45";

// A plain action sitting on the capsule.
export const glassButton = `${segment} px-[1.3em] border-transparent text-white/90 hover:bg-white/10 hover:text-white`;

// The main action: the raised inner pill.
export const glassButtonActive = `${segment} px-[1.3em] text-white border-white/45 bg-[radial-gradient(ellipse_45%_70%_at_80%_15%,rgba(255,255,255,0.5),rgba(255,255,255,0)_70%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.05))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_-2px_0_3px_rgba(110,160,255,0.6),inset_2px_0_3px_rgba(255,150,120,0.4),inset_0_-1px_1px_rgba(255,255,255,0.2),0_2px_10px_rgba(0,0,0,0.28)] hover:bg-[radial-gradient(ellipse_45%_70%_at_80%_15%,rgba(255,255,255,0.6),rgba(255,255,255,0)_70%),linear-gradient(180deg,rgba(255,255,255,0.26),rgba(255,255,255,0.08))]`;

// An icon-only action on the capsule, such as Close.
export const glassIconButton = `${segment} px-[0.9em] border-transparent text-white/90 hover:bg-white/10 hover:text-white`;
