# Shake Off

A magic eight ball web app. Shake the ball and get a random meme, then download or share it as a card.

## Commands

- `npm run dev` start the dev server
- `npm run build` production build (validates `src/content/answers.json` first)
- `npm run lint` lint
- `npm run typecheck` type check
- `npm run validate:content` validate `answers.json` on its own

## Content

Answers live in `src/content/answers.json`. Meme images go in `public/memes/` and are referenced as `/memes/name.jpg`. Every image in `public/memes/` needs an entry with `alt` text, or the build fails and prints the entry to add.

## Testing on a phone

Motion sensors (shake detection) only work over HTTPS. To test on a real phone, use `npx next dev --experimental-https` on the same network or a deployed preview URL.
