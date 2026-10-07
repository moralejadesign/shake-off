import Image from "next/image";
import type { Answer } from "@/lib/types";

type ResultCardProps = {
  answer: Answer;
  // The export copy renders at 1080px wide, loads its images eagerly, and has square corners.
  forExport?: boolean;
};

// The photo window of polaroid-frame.png (922x1170), as a share of the frame.
// The window is translucent film with scratches, so the frame sits on top of the meme.
const WINDOW = { left: "6.4%", top: "7.44%", width: "87.53%", height: "68.89%" };

// Memes this close to square fill the window, cropping only margins.
// Wider or taller ones fit inside it so their text is never cut.
function fillsWindow(answer: Answer) {
  const ratio = answer.width / answer.height;
  return ratio >= 0.78 && ratio <= 1.15;
}

// The shareable card, 9:16 like the 1080x1920 story export. Positions follow the
// owner's reference and use container units, so the preview and the export match.
export function ResultCard({ answer, forExport = false }: ResultCardProps) {
  const loading = forExport ? "eager" : undefined;
  const sizes = (cqw: number) => (forExport ? `${Math.round(10.8 * cqw)}px` : `${Math.round(0.45 * cqw)}vh`);

  return (
    <div className="@container w-full">
      <article
        className={`relative aspect-[9/16] w-full overflow-hidden bg-sky text-white ${forExport ? "" : "rounded-[3cqw] shadow-2xl"}`}
      >
        <Image
          src="/shakeoff-background2.png"
          alt=""
          fill
          quality={90}
          loading={loading}
          sizes={sizes(100)}
          className="object-cover object-[9%_center]"
        />

        <header className="absolute inset-x-[4.6cqw] top-[4.6cqw] flex justify-between text-[2.2cqw] font-medium tracking-[0.25em] uppercase">
          <span>Build by moraleja.co</span>
          <span>V 0.1 // 2026</span>
        </header>

        <div className="absolute top-[78.8cqw] left-[50.3cqw] aspect-[922/1170] w-[84.6cqw] -translate-1/2 -rotate-[4deg]">
          <div className="absolute overflow-hidden bg-ink" style={WINDOW}>
            <Image
              src={answer.imageUrl}
              alt={answer.alt}
              fill
              quality={90}
              loading={loading}
              sizes={sizes(74)}
              className={fillsWindow(answer) ? "object-cover" : "object-contain"}
            />
          </div>
          <Image
            src="/polaroid-frame.png"
            alt=""
            fill
            quality={90}
            loading={loading}
            sizes={sizes(85)}
          />
          {/* Dark copy of the brand lettering, since the cream original disappears on the white caption. */}
          <Image
            src="/shake-off-ink.png"
            alt="Shake Off"
            width={1650}
            height={332}
            loading={loading}
            sizes={sizes(60)}
            className="absolute top-[80%] left-1/2 h-auto w-[72%] -translate-x-1/2"
          />
        </div>

        <Image
          src="/dog-ball.png"
          alt=""
          width={1085}
          height={1450}
          loading={loading}
          sizes={sizes(44)}
          className="absolute top-[135.2cqw] left-[43cqw] h-auto w-[44.2cqw]"
        />
        {/* Mirrored, as in the reference. */}
        <Image
          src="/sheep-ball.png"
          alt=""
          width={1092}
          height={1440}
          loading={loading}
          sizes={sizes(39)}
          className="absolute top-[139.6cqw] left-[15.1cqw] h-auto w-[38.6cqw] -scale-x-100"
        />
      </article>
    </div>
  );
}
