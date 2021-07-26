import { Scene, GameObjects, Game, AUTO, Input } from 'phaser';
import tilemap from '../../assets/sprites/isometric-grass-and-water.json';
import images from '../../assets/sprites/*.png';
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

const WIN_HEIGHT = 600, WIN_WIDTH = 800;

//TODO: vector class
//But is okay to use something simple like interface here
type Position =
  {
    x: number,
    y: number
  }

interface Directions
{
  west: Position,
  northWest: Position,
  north: Position,
  northEast: Position,
  east: Position,
  southEast: Position,
  south: Position,
  southWest: Position
}

const directions: Directions =
  {
    west: { x: -2, y: 0 },
    northWest: { x: -2, y: -1 },
    north: { x: 0, y: -2 },
    northEast: { x: 2, y: -1 },
    east: { x: 2, y: 0 },
    southEast: { x: 2, y: 1 },
    south: { x: 0, y: 2 },
    southWest: { x: -2, y: 1 }
  };

const SPRITE_KEYS =
  {
    skeleton: 'skeleton',
    house: 'house',
    tiles: 'tiles'
  };

const MAP_KEY = 'map';

type AnimationFrame =
  {
    startFrame: number,
    endFrame: number,
    frameRate: number,
    loop: boolean
  }

interface SkeletonAnimations
{
  idleUp: AnimationFrame,
  idleDown: AnimationFrame,
  walkUp: AnimationFrame
  walkDown: AnimationFrame
  attackUp: AnimationFrame,
  attackDown: AnimationFrame,
  die: AnimationFrame,
  shoot: AnimationFrame,
}

const SPRITE_ROW_OFFSET = 27 * 6;

const anims: SkeletonAnimations = {
  idleUp: {
    startFrame: 0,
    endFrame: 3,
    frameRate: 8,
    loop: false
  },
  idleDown: {
    startFrame: SPRITE_ROW_OFFSET,
    endFrame: 3 + SPRITE_ROW_OFFSET,
    frameRate: 8,
    loop: false
  },
  walkUp: {
    startFrame: 4,
    endFrame: 11,
    frameRate: 12,
    loop: true
  },
  walkDown: {
    startFrame: 4 + SPRITE_ROW_OFFSET,
    endFrame: 11 + SPRITE_ROW_OFFSET,
    frameRate: 12,
    loop: true
  },
  attackUp: {
    startFrame: 12,
    endFrame: 20,
    frameRate: 12,
    loop: false
  },
  attackDown: {
    startFrame: 12 + SPRITE_ROW_OFFSET,
    endFrame: 20 + SPRITE_ROW_OFFSET,
    frameRate: 12,
    loop: false
  },
  die: {
    startFrame: 20,
    endFrame: 28,
    frameRate: 12,
    loop: false
  },
  shoot: {
    startFrame: 28,
    endFrame: 32,
    frameRate: 12,
    loop: false
  }
};


let scene: Scene;

interface PlayerControls
{
  W: Input.Keyboard.Key,
  A: Input.Keyboard.Key,
  S: Input.Keyboard.Key,
  D: Input.Keyboard.Key
}

class Skeleton extends GameObjects.Sprite
{
  private startX: number;
  private startY: number;

  private readonly speed: number;

  public controls: PlayerControls;

  constructor(scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.skeleton);

    this.startX = x;
    this.startY = y;

    this.speed = speed;
    this.depth = y + 64;

    this.setAnimations();

    this.controls = this.scene.input.keyboard.addKeys('W,A,S,D') as PlayerControls;
  }

  setAnimations()
  {
    for (const key in anims)
    {
      // noinspection JSUnfilteredForInLoop
      const animation = anims[key];

      // noinspection JSUnfilteredForInLoop
      this.anims.create({
        key: key,
        frames: this.anims.generateFrameNumbers(SPRITE_KEYS.skeleton, { start: animation.startFrame, end: animation.endFrame }),
        frameRate: animation.frameRate,
        repeat: animation.loop ? -1 : 0,
      });
    }
  }

  update()
  {
    const controls = this.controls;
    let direction: Position | undefined;

    if (controls.W.isDown) direction = directions.north;
    else if (controls.S.isDown) direction = directions.south;

    if (controls.D.isDown)
    {
      if (direction) direction = direction === directions.north ? directions.northEast : directions.southEast;
      else direction = directions.east;
    }
    else if (controls.A.isDown)
    {
      if (direction) direction = direction === directions.north ? directions.northWest : directions.southWest;
      else direction = directions.west;
    }

    //TODO: Mot call animations every single frame,
    //TODO: Call it by key not string
    if (!direction)
    {
      this.anims.play('idleUp', true);
      return;
    }

    this.x += direction.x * this.speed;

    if (direction.y !== 0)
    {
      this.y += direction.y * this.speed;
      this.depth = this.y + 64;
    }

    this.anims.play('walkUp', true);
  }
}

class Example extends Scene
{
  private fpsText: GameObjects.Text;
  private cameraControls: CursorKeys;
  private player: Skeleton;

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
    scene = this;

    this.buildMap();
    this.placeHouses();

    this.add.existing(this.player = new Skeleton(this));

    const mainCamera = this.cameras.main;

    mainCamera.setSize(WIN_WIDTH, WIN_HEIGHT);
    this.fpsText = this.add.text(16, 16, "60 fps").setScrollFactor(0, 0);

    const keyboard = this.input.keyboard;

    this.cameraControls = keyboard.createCursorKeys();

    mainCamera.startFollow(this.player);
  }

  update()
  {
    this.player.update();

    const controls = this.cameraControls;
    const scrollSpeed = 0.01;

    //TODO: Rotate this differently temporally
    if (controls.right.isDown) this.cameras.main.rotation += scrollSpeed;
    else if (controls.left.isDown) this.cameras.main.rotation -= scrollSpeed;

    if (controls.up.isDown) this.cameras.main.rotation -= scrollSpeed;
    else if (controls.down.isDown) this.cameras.main.rotation += scrollSpeed;

    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} fps`);
  }


  buildMap()
  {
    //  Parse the data out of the map
    const data = scene.cache.json.get(MAP_KEY);
    const tileWidth = data.tilewidth, tileHeight = data.tileheight;

    const tileWidthHalf = tileWidth * .5;
    const tileHeightHalf = tileHeight * .5;

    const firstLayer = data.layers[0];

    const layer = firstLayer.data;

    const mapWidth = firstLayer.width, mapHeight = firstLayer.height;

    const centerX = mapWidth * tileWidthHalf;
    const centerY = 16;

    let i = 0;

    for (let y = 0; y < mapHeight; y++)
    {
      for (let x = 0; x < mapWidth; x++)
      {
        const id = layer[i] - 1;

        const tx = (x - y) * tileWidthHalf;
        const ty = (x + y) * tileHeightHalf;

        const tile = scene.add.image(centerX + tx, centerY + ty, SPRITE_KEYS.tiles, id);

        tile.depth = centerY + ty;

        i++;
      }
    }
  }

  placeHouses()
  {
    const house_1 = scene.add.image(240, 370, SPRITE_KEYS.house);
    house_1.depth = house_1.y + 86;

    const house_2 = scene.add.image(1300, 290, SPRITE_KEYS.house);
    house_2.depth = house_2.y + 86;
  }
}

const config = {
  type: AUTO,
  width: WIN_WIDTH,
  height: WIN_HEIGHT,
  backgroundColor: '#1D4711',
  scene: [Example]
};

new Game(config);
