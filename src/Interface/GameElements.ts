import { Sprite, Text, Graphics, Container } from 'pixi.js';

export interface GameElements {
  background: Sprite;
  wheelStand: Sprite;
  wheelBase: Graphics;
  arrow: Sprite;
  playButton: Sprite;
  restartButton: Sprite;
  playText: Text;
  restartText: Text;
  numberButtons: {
    bg: Sprite;
    border: Sprite;
    number: Sprite;
  }[];
  popup: Container;
  popupText: Text;
}
