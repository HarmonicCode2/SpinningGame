import {Graphics,Text,Container} from "pixi.js";

export class PopupManager extends Container{
    private background:Graphics;
    private messageText:Text;

    constructor(){
        super();

        this.background=new Graphics();
        this.background.beginFill(0x003366, 0.9);
        this.background.drawRoundedRect(-150, -50, 300, 100, 15);
        this.background.endFill();
        this.addChild(this.background);

        this.messageText=new Text("",{
            fontFamily:"Arial",
            fontSize:24,
            fill:0xffffff,
            align:"center",

        });
        this.messageText.anchor.set(0.5);
        this.addChild(this.messageText);

        this.visible=false;
    }
    showMessage(message:string,duration=2000){
        this.messageText.text=message;
        this.visible=true;

        setTimeout(()=>{
            this.visible=false;

        },duration);

    }
}