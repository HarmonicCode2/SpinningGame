import { Application } from "pixi.js";
import { Background } from "../game/Background";
import {Wheel} from "../game/Wheel";
import { BetNumber } from "../game/BetNumber";

class SpinningGame {
  private app: Application;
  private background?: Background; 
  private wheel?:Wheel;
  private betNumber?:BetNumber;
  private selectedBetNumber:number |null=null;

  constructor(app: Application) {
    this.app = app;
  }

  async init() {
    this.background = new Background(this.app);
    this.betNumber= new BetNumber((selectedNumber:number)=>{
      this.selectedBetNumber=selectedNumber;
    });

    this.wheel=new Wheel(
      this.app,
      ()=>this.selectedBetNumber,
      this.betNumber
    );

  }



   

  destroy() {
    this.background?.destroy();
    this.wheel?.destroy();
    this.betNumber?.destroy();
  }
}

export default SpinningGame;
