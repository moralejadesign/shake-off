// Sound for the whole app, on the Web Audio API. Effects play from decoded buffers so
// they start instantly; the music streams from an <audio> element routed through a
// gain node, because iOS ignores the volume property on plain audio elements.
// Browsers only allow sound after a tap, so startAudio() must be called from one.

export type Effect = "shake" | "type";

const MUSIC_URL = "/audio/music.mp3";

const EFFECTS: Record<Effect, { url: string; volume: number; offset: number }> = {
  shake: { url: "/audio/shake.mp3", volume: 0.9, offset: 0 },
  // The recording starts with a short silence before the first key.
  type: { url: "/audio/type.wav", volume: 0.55, offset: 0.1 },
};

// Kept low so the effects stay easy to hear over it.
const MUSIC_VOLUME = 0.08;

const STORAGE_KEY = "shakeoff:muted";

let context: AudioContext | null = null;
let master: GainNode | null = null;
let music: HTMLAudioElement | null = null;
const buffers = new Map<Effect, AudioBuffer>();
const listeners = new Set<() => void>();
let muted = readMuted();

function readMuted() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

async function loadEffect(name: Effect, ctx: AudioContext) {
  try {
    const response = await fetch(EFFECTS[name].url);
    buffers.set(name, await ctx.decodeAudioData(await response.arrayBuffer()));
  } catch {
    // A missing effect only means silence.
  }
}

// Pauses everything while the tab is hidden and picks up again when it returns.
function handleVisibility() {
  if (!context || !music) return;
  if (document.hidden) {
    void context.suspend();
    music.pause();
  } else {
    void context.resume();
    void music.play().catch(() => undefined);
  }
}

// Unlocks audio and starts the music. Call it synchronously inside a tap handler.
export function startAudio() {
  if (context || typeof window === "undefined" || typeof window.AudioContext !== "function") return;
  const ctx = new AudioContext();
  context = ctx;
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);

  music = new Audio(MUSIC_URL);
  music.loop = true;
  const musicGain = ctx.createGain();
  musicGain.gain.value = MUSIC_VOLUME;
  ctx.createMediaElementSource(music).connect(musicGain).connect(master);
  void music.play().catch(() => undefined);
  void ctx.resume();

  for (const name of Object.keys(EFFECTS) as Effect[]) void loadEffect(name, ctx);
  document.addEventListener("visibilitychange", handleVisibility);
}

// Plays an effect and returns a function that stops it. `loop` repeats it until stopped.
export function playEffect(name: Effect, { gain = 1, loop = false } = {}): () => void {
  const buffer = buffers.get(name);
  if (!context || !master || !buffer) return () => undefined;
  const { volume, offset } = EFFECTS[name];
  const source = context.createBufferSource();
  source.buffer = buffer;
  if (loop) {
    source.loop = true;
    source.loopStart = offset;
    source.loopEnd = buffer.duration;
  }
  const effectGain = context.createGain();
  effectGain.gain.value = volume * gain;
  source.connect(effectGain).connect(master);
  source.start(0, offset);
  return () => {
    try {
      source.stop();
    } catch {
      // Already stopped.
    }
  };
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (master && context) master.gain.setTargetAtTime(value ? 0 : 1, context.currentTime, 0.05);
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // The choice just will not be remembered.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeMuted(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
