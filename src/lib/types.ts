// Every answer is a meme from public/memes/. Width and height are the image's
// pixel size, checked against the file by scripts/validate-content.mjs.
export type Answer = {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  alt: string;
  tags?: string[];
};
