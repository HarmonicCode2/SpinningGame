import { Sprite, Application } from "pixi.js";

export class Background {
  private sprite: Sprite;
  private resizeHandler: () => void;
  private app:Application;

  constructor( app: Application) {
    
    this.sprite = Sprite.from("background");
    this.app=app;

    
    this.resizeHandler = this.resize.bind(this);
    this.app.stage.addChild(this.sprite);

    requestAnimationFrame(this.resizeHandler);

    // this.resizeHandler(); 
   
    window.addEventListener("resize", this.resizeHandler);
  }

  private resize() {
    const { width, height } = this.app.renderer;
    this.sprite.width = width;
    this.sprite.height = height;
  }

  destroy() {
    window.removeEventListener("resize", this.resizeHandler);
    this.app.stage.removeChild(this.sprite);
    this.sprite.destroy();
  }
}
