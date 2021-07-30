import { GameObjects, Scene } from "phaser";
import tilemap from "../../assets/sprites/isometric-grass-and-water.json";
import images from "../../assets/sprites/*.png";
// noinspection ES6PreferShortImport
import { Skeleton } from "../gameobjects/skeleton";
// noinspection ES6PreferShortImport
import { MAP_KEY, SPRITE_KEYS } from "../game-config";
// noinspection ES6PreferShortImport
import { Zombie } from "../gameobjects/zombie";
// noinspection ES6PreferShortImport
import { NiceZombie } from "../gameobjects/nice-zombie";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Label = RexUIPlugin.Label;
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import Buttons = UIPlugins.Buttons;

export class MainScene extends Scene
{
  public rexUI: RexUIPlugin;

  private fpsText: GameObjects.Text;
  private cameraControls: CursorKeys;
  private player: Skeleton;
  private _cameraRotation = 0;
  private _cameraZoom = 0;

  preload()
  {
    this.load.json(MAP_KEY, tilemap);

    //TODO: user atlas for performance
    this.load.spritesheet(SPRITE_KEYS.skeleton, images.skeleton8, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet(SPRITE_KEYS.tiles, images.isometric_grass_and_water, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(SPRITE_KEYS.zombie, images.zombie, { frameWidth: 128, frameHeight: 128 });

    this.load.image(SPRITE_KEYS.house, images.rem_0002);
  }

  create()
  {
    this.buildMap();

    const mainCamera = this.cameras.main;

    const houses = this.placeHouses();

    const zombies = this.physics.add.group();

    const niceZombie = new NiceZombie(this, 900, 200);
    const simpleZombie = new Zombie(this, 1100, 400);

    this.player = new Skeleton(this);

    zombies.add(niceZombie);
    zombies.add(simpleZombie);

    zombies.children.iterate(z =>
    {
      const zombie = z as Zombie;
      zombie.player = this.player;
      zombie.setCollider();
    });

    const stopPlayerMovement = () => this.player.clearTargetTile();
    this.physics.add.collider(houses, this.player, stopPlayerMovement);
    this.physics.add.collider(zombies, this.player, stopPlayerMovement);

    this.fpsText = this.add.text(16, 16, "60 fps, 0 objects").setScrollFactor(0, 0);
    this.fpsText.depth = 1000;

    const keyboard = this.input.keyboard;

    this.cameraControls = keyboard.createCursorKeys();

    mainCamera.startFollow(this.player);

    this.createButtons();
  }

  //TODO: understand this buttons and all ui to scene ui
  createButtons()
  {
    const COLOR_PRIMARY = 0x4e342e;
    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;

    const createButton = (scene: MainScene, text: string): Label => scene.rexUI.add.label({
      width: 100,
      height: 40,
      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
      text: scene.add.text(0, 0, text, { fontSize: "18px" } as TextStyle),
      space: { left: 10, right: 10, }
    });

    const buttons = this.rexUI.add.buttons({
      x: 100, y: 300,
      orientation: 'y',

      buttons: [
        createButton(this, 'Spell'),
      ],

      space: { item: 8 }

    }).layout()

    buttons.on('button.click', (button: Label, index: number) =>
    {
      buttons.setButtonEnable(index, false);
      button.setAlpha(0.5);
      setTimeout(() =>
      {
        buttons.setButtonEnable(index, true);
        button.clearAlpha();
      }, 1000);
    });
  }

  update()
  {
    this.player.update();

    const controls = this.cameraControls;
    const scrollSpeed = 0.01, zoomSpeed = 0.1;

    if (controls.right.isDown || controls.up.isDown)
    {
      this._cameraRotation += scrollSpeed;
      this.cameras.main.setRotation(this._cameraRotation);
    }
    else if (controls.left.isDown || controls.down.isDown)
    {
      this._cameraRotation -= scrollSpeed;
      this.cameras.main.setRotation(this._cameraRotation);
    }

    if (controls.up.isDown)
    {
      this._cameraZoom += zoomSpeed;
      this.cameras.main.setZoom(this._cameraZoom, this._cameraZoom);
    }
    else if (controls.down.isDown)
    {
      this._cameraZoom -= zoomSpeed;
      this.cameras.main.setZoom(this._cameraZoom, this._cameraZoom);
    }

    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} fps, ${this.children.list.length} objects`);
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

        const tile: GameObjects.Image = tilesGroup.create(centerX + tx, centerY + ty, SPRITE_KEYS.tiles, id);
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
    //TODO: find how to create houses with simple iteration
    const houses = this.physics.add.staticGroup();

    const house_1: GameObjects.Image = houses.create(240, 370, SPRITE_KEYS.house);
    const house_2: GameObjects.Image = houses.create(1300, 290, SPRITE_KEYS.house);

    houses.add(house_1);
    houses.add(house_2);

    houses.children.iterate(h =>
    {
      const house = h as GameObjects.Image;
      house.depth = house.y + 86;

      const size = { width: house_1.width * .5, height: house_1.height * .5 };
      (house.body as Phaser.Physics.Arcade.Body).setSize(size.width, size.height);
    });

    return houses;
  }
}
