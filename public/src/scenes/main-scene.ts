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
