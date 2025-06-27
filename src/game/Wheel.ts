import { Application, Sprite, Container, Text, isMobile } from "pixi.js";
import { gsap } from "gsap";
import { soundManager } from "../utils/soundManager";
import { BetNumber } from "./BetNumber";
import { PopupManager } from "./PopupManager";

export class Wheel {
  public wheelBase: Sprite;
  public stand: Sprite;
  public arrow: Sprite;
  public playButton: Sprite;
  public balanceButton: Sprite;
  public restartButton: Sprite;
  public playText: Text;
  public restartText: Text;
  public balanceText: Text;
  public balance: number = 100;
  public amount: number = 10;
  public amountText: Text;
  public increase: number = 10;
  public increaseText: Text;
  public decrease: number = 10;
  public decreaseText: Text;

  private mainContainer: Container;
  private wheelContainer: Container;
  private uiContainer: Container;
  private betContainer: Container;
  private buttonContainer: Container;
  private amountTile: Container;
  private increaseButton: Container;
  private decreaseButton: Container;

  private resizeHandler: () => void;
  private targetSegment = 5;
  private spinning = false;
  private betNumber: BetNumber;
  private app: Application;
  private popup: PopupManager;

  constructor(
    app: Application,
    private getSelectedBet: () => number | nul,
    betNumber: BetNumber
  ) {
    this.app = app;
    this.mainContainer = new Container();
    this.app.stage.addChild(this.mainContainer);

    this.wheelContainer = new Container();
    this.mainContainer.addChild(this.wheelContainer);

    this.stand = Sprite.from("stand");
    this.stand.anchor.set(0.5);

    this.wheelBase = Sprite.from("wheelBase");
    this.wheelBase.anchor.set(0.5);

    this.arrow = Sprite.from("arrow");
    this.arrow.anchor.set(0.5, 0.1);

    this.wheelContainer.addChild(this.wheelBase, this.stand, this.arrow);

    this.uiContainer = new Container();
    this.mainContainer.addChild(this.uiContainer);

    this.betNumber = betNumber;
    this.betContainer = new Container();
    this.betContainer.addChild(this.betNumber);
    this.uiContainer.addChild(this.betNumber);

    this.playButton = Sprite.from("buttonBg");
    this.playButton.anchor.set(0.6,1.9);
    this.playButton.eventMode = "static";
    this.playButton.cursor = "pointer";
    this.playButton.on("pointerdown", this.onPlay.bind(this));

    this.playText = new Text("Play", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
   
    this.playText.anchor.set(this.playButton.x-2,this.playButton.y+3);
    this.uiContainer.addChild( this.playButton,this.playText);

    this.balanceButton = Sprite.from("buttonBg");
    this.balanceButton.anchor.set(0.4);
    this.balanceButton.eventMode = "static";
    this.balanceButton.cursor= "pointer";
    this.balanceText = new Text("Balance:100", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
    this.balanceText.anchor.set(0.5);
    this.uiContainer.addChild(this.balanceButton, this.balanceText);

    this.restartButton = Sprite.from("buttonBg");
    this.restartButton.anchor.set(-0,0.9);
    this.restartButton.eventMode = "static";
    this.restartButton.cursor = "pointer";
    this.restartButton.on("pointerdown", this.onRestart.bind(this));

    this.restartText = new Text("Reset", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
    this.restartText.anchor.set(this.restartButton.x-1.5,this.restartButton.y+1.8);
    this.restartText.scale.set(0.7);
    this.uiContainer.addChild(this.restartButton, this.restartText);

    this.buttonContainer = new Container();
    this.buttonContainer.addChild(
     
      this.playButton,
       this.playText,
      this.restartButton,
      this.restartText,
      this.balanceButton,
      this.balanceText
    );
    this.uiContainer.addChild(this.buttonContainer,this.betContainer);

    this.popup = new PopupManager();
    this.uiContainer.addChild(this.popup);
    this.createAmountControls();

    this.resizeHandler = this.resize.bind(this);
    window.addEventListener("resize", this.resizeHandler);
    this.resize();
  }

  private createAmountControls() {
    this.amountTile = new Container();
    const amountBg = Sprite.from("buttonBg");
    amountBg.anchor.set(0.5);
    amountBg.scale.set(1);

    this.amountText = new Text(`Bet Amount:${this.amount}`, {
      fontFamily: "Arial",
      fontSize: 25,
      fill: 0xffffff,
      
    });
    this.amountText.anchor.set(0.5,0.8);
    this.amountText.scale.set(1.3);
    this.amountTile.addChild(amountBg, this.amountText);

    this.decreaseButton = new Container();
    const decBg = Sprite.from("right");
    decBg.anchor.set(0.5);
    decBg.scale.set(1.6);
    this.decreaseText = new Text("", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
    });
    this.decreaseText.anchor.set(0.5);
    this.decreaseButton.addChild(decBg, this.decreaseText);
    this.decreaseButton.eventMode = "static";
    this.decreaseButton.cursor = "pointer";
    this.decreaseButton.on("pointerdown", () => this.updateBetAmount(10));

    this.increaseButton = new Container();
    const incBg = Sprite.from("left");
    incBg.anchor.set(0.5);
    incBg.scale.set(1.6);
    this.increaseText = new Text("", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
    });
    this.increaseText.anchor.set(0.5);
    this.increaseButton.addChild(incBg, this.increaseText);
    this.increaseButton.eventMode = "static";
    this.increaseButton.cursor = "pointer";
    this.increaseButton.on("pointerdown", () => this.updateBetAmount(-10));

    this.uiContainer.addChild(this.amountTile, this.increaseButton, this.decreaseButton);
  }

  private updateBetAmount(change: number) {
    const newAmount = this.amount + change;
    const minBet=10;
    if (newAmount >= minBet) {
      this.amount = newAmount;
      this.amountText.text = `BetAmount:${this.amount}`;
    }else {
  this.popup.showMessage(`Minimum bet is ${minBet}`);
}
    
  }

  private resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width <= 470;
    const designWidth = isMobile ? 370 : 1024;
    const designHeight = isMobile ? 740 : 768;

    const scale = Math.min(width / designWidth, height / designHeight);
    this.mainContainer.scale.set(scale);
    this.mainContainer.x = width / 2;
    this.mainContainer.y = height / 2;

    const screenBottom = height / scale;
    const buttonOffset = 450;
    const buttonY = screenBottom - buttonOffset;
   



    if (isMobile) {
      this.playButton.setTransform(30, buttonY - 30);
      this.playText.setTransform(this.playButton.x -110, this.playButton.y-25);
      this.restartButton.setTransform(-100, buttonY -10);
      this.restartText.setTransform(this.restartButton.x + 10, this.restartButton.y);
      this.wheelContainer.scale.set(0.6);
      this.uiContainer.scale.set(0.6);
      this.amountTile.setTransform(0,buttonY-190);
      this.increaseButton.setTransform(-230,buttonY-200);
      this.decreaseButton.setTransform(230,buttonY-200);
      this.balanceButton.scale.set(0.7);
      this.balanceText.scale.set(1.3);
      this.balanceButton.setTransform(-20,buttonY-1080);
      this.balanceText.setTransform(this.balanceButton.x+12,this.balanceButton.y);
      
    } else {
      this.playText.setTransform(this.playButton.x-120, this.playButton.y+10 - this.playButton.height / 2 - 10);
      this.playButton.setTransform(-90, buttonY +25);
      this.restartButton.setTransform(10, buttonY -30);
      this.restartText.setTransform(this.restartButton.x + 10, this.restartButton.y);
      this.playButton.scale.set(0.6);
      this.playText.scale.set(0.7);
      this.restartButton.scale.set(0.6);
      this.restartText.scale.set(0.7);
    }

    this.betNumber.y=isMobile?0-designHeight*0.16:0;

    this.popup.x = isMobile ? 0 : -width * 0.15;
    this.popup.y = -height / (2 * scale) + (isMobile ? 10 : 80);
    this.wheelContainer.x = isMobile ? 0 : -designWidth * 0.25;
    this.wheelContainer.y = isMobile ? -designHeight * 0.16 : 0;
    this.uiContainer.x = isMobile ? 0 : designWidth * 0.3;
    this.uiContainer.y = isMobile ? designHeight * 0.2 : 0;

    const wheelScale = isMobile ? 0.4 : 0.5;
    this.stand.setTransform(0, -60, wheelScale, wheelScale);
    this.wheelBase.setTransform(0, -80, wheelScale, wheelScale);
    this.arrow.setTransform(0, -130, wheelScale, wheelScale);

    this.betContainer.setTransform(0, isMobile ? -70 : -120);
    this.betContainer.scale.set(isMobile ? 0.6 : 0.5);

    this.balanceButton.scale.set(0.6);
    this.balanceText.scale.set(0.7);
    this.playButton.scale.set(0.6);
    this.playText.scale.set(0.8);
    this.restartButton.scale.set(0.6);
    this.restartText.scale.set(0.8);

    this.balanceButton.x = isMobile ? -10 : -width * 0.18;
    this.balanceButton.y = isMobile ? -height * 1.1 : -height * 0.4;
    this.balanceText.x = this.balanceButton.x + 25;
    this.balanceText.y = this.balanceButton.y;
    

    if (!isMobile) {
      this.amountTile.setTransform(-5, 180);
      this.increaseButton.setTransform(-150, 175);
      this.decreaseButton.setTransform(140, 175);
      this.amountTile.scale.set(0.6);
      this.increaseButton.scale.set(0.6);
      this.decreaseButton.scale.set(0.6);
    }
  }

  private onPlay() {
    if (this.spinning) return;
    const selectedBet = this.getSelectedBet();
    if (selectedBet === null) {
      this.popup.showMessage("Please place bet first!!");
      return;
    }

    gsap.killTweensOf(this.wheelBase);
    this.wheelBase.rotation = 0;
    const selectedNumber = Math.floor(Math.random() * 10);
    this.targetSegment = this.getSegmentIndexFromNumber(selectedNumber);
    this.spinning = true;
    soundManager.spin.play();

    const anglePerSegment = (2 * Math.PI) / 10;
    const totalRotation = 12 * 2 * Math.PI + this.targetSegment * anglePerSegment + 4;

    const timeline = gsap.timeline({
      onComplete: () => {
        this.spinning = false;
        const result = (10 - this.targetSegment) % 10;
        const won = selectedBet === result;
        this.popup.showMessage(won ? "You win!" : "You lose");
        this.updateBalance(won ? this.amount : -this.amount);

        setTimeout(()=>{
          this.onRestart();

        },1500);
      }
    });

    timeline
      .to(this.wheelBase, { rotation: `+=${totalRotation * 0.1}`, duration: 1, ease: "power2.in" })
      .to(this.wheelBase, { rotation: `+=${totalRotation * 0.4}`, duration: 1.5, ease: "none" })
      .to(this.wheelBase, { rotation: `+=${totalRotation * 0.5}`, duration: 9, ease: "power4.out" })
      .to(this.wheelBase, {
    rotation: `-=${0.20}`, 
    duration: 0.2,
    ease: "power2.inOut",
  })
  .to(this.wheelBase, {
    rotation: `+=${0.05}`, 
    duration: 0.15,
    ease: "power1.out",
  });

  }

  private onRestart() {
    this.spinning = false;
    gsap.killTweensOf(this.wheelBase);
    this.wheelBase.rotation = 0;
    this.betNumber.clearSelection();
    this.amount=10;
    this.amountText.text = `BetAmount:${this.amount}`;
    // this.popup.showMessage("Bet has been reset. Please place a new one.");
  }

  private getSegmentIndexFromNumber(num: number): number {
    return (10 - num) % 10;
  }

  private updateBalance(change: number) {
    this.balance = Math.max(0, this.balance + change);
    this.balanceText.text = `Balance:${this.balance}`;
  }

  public destroy() {
    window.removeEventListener("resize", this.resizeHandler);
    this.app.stage.removeChild(this.mainContainer);
    this.mainContainer.destroy({ children: true });
    this.playButton.destroy();
    this.restartButton.destroy();
    this.playText.destroy();
    this.restartText.destroy();
    this.wheelBase.destroy();
    this.stand.destroy();
    this.arrow.destroy();
  }
}