# CLAUDE.md

## Project

A magic eight ball web app. The user shakes the ball (phone motion, or a button/drag on desktop) and gets a random meme from `public/memes/`. The meme appears as a shareable card the user can download as a PNG or share through the native share sheet.

The owner provides all content (the meme images). Do not add, generate, or change memes.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS
- Motion (`motion` package, formerly Framer Motion, imported from `motion/react`) for the ball, the intro sequence, and UI transitions
- `next/image` for all illustrations (ball, characters, title, background)
- html-to-image for exporting the card as PNG
- use-sound for the rattle sound (optional, add in polish phase)
- Deploy target: Vercel

## Commands

- `npm run dev` start dev server
- `npm run build` production build
- `npm run lint` lint
- `npm run typecheck` runs `next typegen && tsc --noEmit` (typegen creates the route types like `LayoutProps`)

Run `lint` and `typecheck` before saying any task is done.

## Folder structure

```
src/
  app/
    layout.tsx
    page.tsx
    icon.png         favicon, the "8" ball from magicball-front.png (192px)
    apple-icon.png   home screen icon, the ball on sky blue (180px)
    opengraph-image.jpg, twitter-image.jpg  link preview (1200x628), with .alt.txt files
  components/
    Scene/           landing composition, intro timeline, background, title, corner labels
    Ball/            2D ball pair (front and back illustrations) and its animation
    Characters/      sheep and dog illustrations
    SpeechBubble/    character speech bubbles
    AnswerOverlay/   HTML overlay positioned over the ball window
    ResultCard/      the shareable card (also the export target)
    ShakeButton/     fallback trigger for desktop and accessibility
  hooks/
    useShake.ts      DeviceMotion detection + iOS permission flow
    useShakeFlow.ts  idle > shaking > revealing > card state and timings
    useShareCard.ts  PNG export, Web Share, download fallback
  lib/
    pickAnswer.ts    random pick, never repeats the last answer
    renderCardPng.ts html-to-image capture of the 1080x1920 card
    answers.ts       typed import of answers.json
    buttonClasses.ts shared button styles
    types.ts
  content/
    answers.json     one entry per meme, with its alt text
scripts/
  validate-content.mjs  validates answers.json and syncs it with public/memes, runs as prebuild
public/
  memes/             meme images, provided by the owner
  fonts/             Input Mono Condensed
  *.png              ball, character, title, and background illustrations
```

## Content format

Every answer is a meme. There are no text phrases.

`src/content/answers.json` is an array of:

```ts
type Answer = { id: string; imageUrl: string; width: number; height: number; alt: string; tags?: string[] };
```

- `public/memes/` is the source of truth. Every image in it must have exactly one entry, referenced by `imageUrl` like `/memes/meme01.jpg`.
- Every meme needs an `alt` string that describes the image and quotes its text.
- `width` and `height` are the image's pixel size. Memes must be JPG or PNG so the validator can read them.
- `scripts/validate-content.mjs` runs before every build and fails it on a malformed entry, a missing image, a wrong size, or an image in the folder with no entry. It prints the JSON to add.
- Alt texts written by Claude are tagged `alt-needs-review` until the owner checks them.

## Core behavior

1. **Shake input.** `useShake` listens to `devicemotion`, triggers when acceleration magnitude passes a threshold, and debounces so one shake fires once.
   - iOS needs `DeviceMotionEvent.requestPermission()` called from a user tap. Show a clear "Enable shake" button first on iOS.
   - Sensors only work over HTTPS. Note this in the README.
   - Desktop and no-sensor fallback: a visible "Shake" button, plus click-and-drag on the ball.
2. **Ball animation.** Rotation and position wobble on the ball illustrations, driven by Motion springs. Shake strength changes the intensity. After the shake settles (about 600 to 900 ms), reveal the answer. Tune on a real phone, not a simulator.
3. **Answer display.** Render the answer as an HTML overlay over the ball window. Use CSS fade and scale for the reveal.
4. **Result card.** After the reveal, show a card with the meme and the owner's branding, in a native `<dialog>`. Focus returns to the element that opened it. Buttons: Download, Share, Shake again.
5. **Export.** One size only: 9:16, 1080x1920 (story). The card on screen is the same 9:16 layout, sized in container units (`cqw`), so the preview matches the PNG.
   - Card layout (from the owner's polaroid reference): sky background, "Build by moraleja.co" top left and "V 0.1 // 2026" top right, a polaroid (`public/polaroid-frame.png`) tilted -4deg with the meme under its translucent, scratched window and the "Shake Off" lettering in its caption strip, then the mirrored sheep and the dalmatian cut off by the bottom edge. Memes near square (ratio 0.78 to 1.15) fill the window; others fit inside it on dark film so their text is never cropped.
   - The dialog renders a second, off-screen copy of `ResultCard` at 1080px wide (`forExport`), and `html-to-image` captures that copy at pixel ratio 1.
   - The PNG is rendered as soon as the card opens, so Share can call `navigator.share()` directly from the tap. iOS rejects it after a long await. Share and Download stay `aria-disabled` until the PNG is ready.
   - Wait for `document.fonts.ready` and every image before capturing. Pass `includeQueryParams: true`, since `next/image` URLs differ only by query string. WebKit gets one warm-up render because its first pass can draw images blank.
   - Use Web Share with files when `navigator.canShare({ files })` is true, otherwise download. Closing the share sheet (AbortError) is not an error.
6. **Random pick.** `pickAnswer` never returns the same answer twice in a row.

## Ball and scene guidelines

- The ball is 2D, not 3D. It is two halftone illustrations, `magicball-front.png` (the "8") and `magicball-back.png` (the answer window), layered and animated with Motion. Do not add three.js or React Three Fiber.
- The landing layout follows the owner's reference: balls and title share one box sized in `vw`/`svh`, so the composition holds at any viewport. Characters sit in the bottom corners with their speech bubbles attached.
- Intro order: background, corner labels, balls, title, characters, then speech bubbles. Timings live in `components/Scene/introTimeline.ts`.
- Animate with `transform`, `opacity`, and `clip-path` only. Test on a mid-range Android phone.
- Respect `prefers-reduced-motion`: keep the order but play quick fades, no idle float, no long animations. Any server-rendered initial state must still reach its final state when reduced motion is on.
- Use `next/image` with `quality={90}` for the halftone art so the dots stay crisp.

## Code conventions

- TypeScript strict. No `any`.
- Function components and hooks only.
- Components that touch browser APIs (DeviceMotion, Web Share, Motion animations) are client components. Guard every browser API call with a feature check.
- Tailwind for styling. No CSS-in-JS.
- Keep components small. If a file passes about 150 lines, split it.
- Name files by what they contain. No `utils.ts` dumping grounds.
- No new dependencies without saying why in the response.

## Buttons

- Buttons use liquid glass from `src/lib/buttonClasses.ts`, after the owner's reference: each row of buttons sits in one smoky glass capsule (`glassBar`). The main action is a raised inner glass pill (`glassButtonActive`) with a specular highlight and a blue and warm edge fringe; other actions are plain labels on the capsule (`glassButton`, `glassIconButton`).
- Button rows stay on one line on every screen. On the card, Close is an icon with `aria-label="Close"` so the row fits a 360px phone.
- Do not give one element two Tailwind classes for the same property (for example two `px-` values). Which one wins is not guaranteed.
- Write Tailwind classes out in full. Tailwind does not see classes built with template interpolation.

## Accessibility

- Every shake action has a button alternative.
- The revealed answer is announced with `aria-live="polite"`.
- Meme images have meaningful `alt` text.
- Buttons are keyboard reachable with visible focus.

## Do not

- Do not add, remove, or change meme images. Content comes from the owner.
- Do not use third-party meme templates, characters, or logos.
- Do not add a backend, database, or auth. This app is fully static and client-side.
- Do not add analytics until asked.
- Do not use em dashes in any copy, comments, or docs.

## Build phases

Work one phase at a time. Stop after each phase and summarize what changed.

1. **Scaffold.** Next.js + TypeScript + Tailwind, folder structure, `answers.json` for the owner's memes.
2. **Ball.** Shake animation on the 2D ball pair, triggered by the button.
3. **Shake input.** `useShake`, iOS permission flow, desktop fallback.
4. **Result card.** `pickAnswer`, answer overlay, card layout.
5. **Export.** PNG download and Web Share, 9:16 at 1080x1920.
6. **Polish.** Sound, vibration (`navigator.vibrate`), loading states, reduced motion, OG metadata.
7. **Launch.** Vercel deploy, test on real iOS and Android devices.

## Definition of done (per phase)

- `npm run lint` and `npm run typecheck` pass.
- `npm run build` succeeds.
- The feature works on desktop Chrome and on a real phone over HTTPS.
- A short note on what was built and anything left open.

## Brand

- Font: Monoblock (Envato Elements license, certificate in `public/fonts/Monoblock/`). Only `public/fonts/web/*.woff2` is served and deployed; `public/fonts/` is git-ignored and `.vercelignore` publishes only `fonts/web`.
- Title: `public/shake-off-title.png`, cream lettering. The share card uses `shake-off-ink.png`, a dark copy generated from it, because cream disappears on the white polaroid caption.
- Background: `public/shakeoff-background2.png`.
- Characters: `sheep-ball.png` and `dog-ball.png`, each holding an 8 ball.
- Colors: cream `#f5f2e1` (paper, bubble), sky blue `#2f7fd8`, ink `#141414`.
- Corner labels: "Shake Off" top left, "Build by moraleja.co" top right, "V 0.1 // 2026" bottom right.
- When replacing an image, use a new file name. The image optimizer caches by URL, so a file overwritten under the same name can keep serving the old version.

## Landing flow

1. Intro: title, then the sheep (mirrored, ball toward the bubble) bobs as it "talks", typing three lines in its bubble: "Having a rough day?", "Shake the ball and get a good meme.", "Share it and send it to someone who needs it." A Skip button, or shaking the phone, jumps ahead.
2. Shake stage: the sheep drops out, the title moves behind the balls (desktop) or stays above them (phone), and the two balls fly in. Positions follow the owner's 2000x1125 references inside a 16:9 frame (`cqw` units) on desktop.
3. Shake: big rattle (up to about 64px and 30deg, with a squash) for 1s, then the "8" ball slides aside while the back ball comes forward with the meme in its window, then the card opens.

## Open questions for the owner

- Font license: the files are the "Testing" builds of Input Mono Condensed. Confirm a web license before launch.
- Logo for the card, if any beyond the "moraleja.co" text.
- Production domain, to set `metadataBase` in `layout.tsx` so share previews use absolute URLs outside Vercel.
- Language: the UI copy is English and the memes are Spanish.
- Review the meme `alt` texts tagged `alt-needs-review`.
