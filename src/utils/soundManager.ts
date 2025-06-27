

import { Howl } from "howler";

export const soundManager = {
  spin: new Howl({ src: ["/sounds/spin.mp3"] }),
  win: new Howl({ src: ["/sounds/win.mp3"] }),
  lose: new Howl({ src: ["/sounds/lost.mp3"] }),
  placeBet: new Howl({ src: ["/sounds/bet.mp3"] }),
};
