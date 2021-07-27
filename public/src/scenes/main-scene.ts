import { GameObjects, Scene } from "phaser";
import tilemap from "../../assets/sprites/isometric-grass-and-water.json";
import images from "../../assets/sprites/*.png";
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
// noinspection ES6PreferShortImport
import { Skeleton } from "../gameobjects/skeleton";
// noinspection ES6PreferShortImport
import { MAP_KEY, SPRITE_KEYS } from "../game-config";

export class MainScene extends Scene
{
  private fpsText: GameObjects.Text;
  private cameraControls: CursorKeys;
  private player: Skeleton;
  private _cameraRotation = 0;
  private _cameraZoom = { x: 1, y: 1 };

  preload()
  {
    this.load.json(MAP_KEY, tilemap);
    this.load.spritesheet(SPRITE_KEYS.tiles, images.isometric_grass_and_water, { frameWidth: 64, frameHeight: 64 });
    //TODO: user atlas for performance
    this.load.spritesheet(SPRITE_KEYS.skeleton, images.skeleton8, { frameWidth: 128, frameHeight: 128 });
    this.load.image(SPRITE_KEYS.house, images.rem_0002);
  }

  create()
  {
    this.buildMap();
    this.placeHouses();

    this.player = new Skeleton(this);

    const mainCamera = this.cameras.main;

    this.fpsText = this.add.text(16, 16, "60 fps").setScrollFactor(0, 0);
    this.fpsText.depth = 1000;

    const keyboard = this.input.keyboard;

    this.cameraControls = keyboard.createCursorKeys();

    mainCamera.startFollow(this.player);
  }

  update()
  {
    this.player.update();

    const controls = this.cameraControls;
    const scrollSpeed = 0.01, zoomSpeed = 0.1;

    if (controls.right.isDown || controls.up.isDown) this.cameras.main.setRotation(this._cameraRotation += scrollSpeed);
    else if (controls.left.isDown || controls.down.isDown) this.cameras.main.setRotation(this._cameraRotation -= scrollSpeed);

    if (controls.up.isDown) this.cameras.main.setZoom(this._cameraZoom.x += zoomSpeed, this._cameraZoom.y += zoomSpeed);
    else if (controls.down.isDown) this.cameras.main.setZoom(this._cameraZoom.x -= zoomSpeed, this._cameraZoom.y -= zoomSpeed);

    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} fps`);
  }


  buildMap()
  {
    //  Parse the data out of the map
    const data = this.cache.json.get(MAP_KEY);
    const tileWidth = data.tilewidth, tileHeight = data.tileheight;

    const tileWidthHalf = tileWidth * .5;
    const tileHeightHalf = tileHeight * .5;

    const firstLayer = data.layers[0];

    const layer = firstLayer.data;

    const mapWidth = firstLayer.width, mapHeight = firstLayer.height;

    const centerX = mapWidth * tileWidthHalf;
    const centerY = 16;

    const tilesGroup = this.add.group();

    let i = 0;

    for (let y = 0; y < mapHeight; y++)
    {
      for (let x = 0; x < mapWidth; x++)
      {
        const id = layer[i] - 1;

        const tx = (x - y) * tileWidthHalf;
        const ty = (x + y) * tileHeightHalf;

        const tile: Phaser.GameObjects.Image = tilesGroup.create(centerX + tx, centerY + ty, SPRITE_KEYS.tiles, id);
        //TODO: check to a way of adding to the whole group the event
        tile.setInteractive();
        //TODO: check how to get the click event of the object itself
        tile.on('pointerdown', () => this.player.setTarget(tile));

        tile.depth = centerY + ty;

        i++;
      }
    }
  }

  placeHouses()
  {
    //TODO: cleaner code here
    const houses = this.physics.add.staticGroup();

    const house_1 = this.add.image(240, 370, SPRITE_KEYS.house);
    house_1.depth = house_1.y + 86;

    const house_2 = this.add.image(1300, 290, SPRITE_KEYS.house);
    house_2.depth = house_2.y + 86;

    houses.add(house_1);
    houses.add(house_2);
  }
}
