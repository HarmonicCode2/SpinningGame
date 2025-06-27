import { Container, Sprite} from "pixi.js";

export class BetNumber extends Container {
  private betTiles: Container[] = [];
  private selectedBet: number | null = null;

  constructor(
    private onBetSelected: (num: number) => void
  ) {
    super();
    this.createTiles();
  }

  private createTiles() {
    const spacingX = 120;
    const spacingY = 120;
    const tilesPerRow = 4;
    const tileScale = 0.5;

    for (let i = 0; i < 10; i++) {
      const tile = new Container();

      const bg = Sprite.from("tileBg");
      const border = Sprite.from("tileBorder");
      const number = Sprite.from(`num_${i}`);

      bg.anchor.set(0.5);
      border.anchor.set(0.5);
      number.anchor.set(0.5);

      bg.scale.set(tileScale);
      border.scale.set(tileScale);
      number.scale.set(tileScale * 0.9);

      tile.addChild(bg, border, number);

      const row = Math.floor(i / tilesPerRow);
      const col = i % tilesPerRow;

      tile.x = col * spacingX;
      tile.y = row * spacingY;

      tile.eventMode = "static";
      tile.cursor = "pointer";
      tile.on("pointerdown", () => {
        this.setSelected(i);
        this.onBetSelected(i);
      });

      this.betTiles.push(tile);
      this.addChild(tile);
    }

    const totalCols = Math.min(tilesPerRow, 10);
    const totalRows = Math.ceil(10 / tilesPerRow);
    const groupWidth = (totalCols - 1) * spacingX;
    const groupHeight = (totalRows - 1) * spacingY;

    this.pivot.x = groupWidth / 2;
    this.pivot.y = groupHeight / 1.4;
  }

  public resize(scale: number) {
    this.scale.set(scale);
  }

  private setSelected(index: number) {
    this.selectedBet = index;

    this.betTiles.forEach((tile, i) => {
      const border = tile.children[1] as Sprite;
      border.tint = i === index ? 0x00ff00 : 0xffffff;
    });
  }

  public getSelected(): number | null {
    return this.selectedBet;
  }

 public clearSelection() {
  this.selectedBet = null;
  this.betTiles.forEach(tile => {
    const border = tile.children[1] as Sprite;
    border.tint = 0xffffff;
  });
}


  
}

