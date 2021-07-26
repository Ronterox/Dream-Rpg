import { Scene, GameObjects, Game, AUTO, Input } from 'phaser';
import tilemap from '../../assets/mapping/isometric-grass-and-water.json';
import images from '../../assets/sprites/*.png';
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

enum Direction { North, East, West, South, NorthEast, NorthWest, SouthEast, SouthWest }

type MoveDirection =
  {
    offset: number,
    x: number,
    y: number,
    opposite: Direction
  }

interface Directions
{
  west: MoveDirection,
  northWest: MoveDirection,
  north: MoveDirection,
  northEast: MoveDirection,
  east: MoveDirection,
  southEast: MoveDirection,
  south: MoveDirection,
  southWest: MoveDirection
}

const directions: Directions =
  {
    west: { offset: 0, x: -2, y: 0, opposite: Direction.East },
    northWest: { offset: 32, x: -2, y: -1, opposite: Direction.NorthWest },
    north: { offset: 64, x: 0, y: -2, opposite: Direction.North },
    northEast: { offset: 96, x: 2, y: -1, opposite: Direction.NorthEast },
    east: { offset: 128, x: 2, y: 0, opposite: Direction.West },
    southEast: { offset: 160, x: 2, y: 1, opposite: Direction.SouthEast },
    south: { offset: 192, x: 0, y: 2, opposite: Direction.South },
    southWest: { offset: 224, x: -2, y: 1, opposite: Direction.SouthWest }
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
    speed: number
  }

interface SkeletonAnimations
{
  idle: AnimationFrame,
  walk: AnimationFrame
  attack: AnimationFrame,
  die: AnimationFrame,
  shoot: AnimationFrame,
}

const anims: SkeletonAnimations = {
  idle: {
    startFrame: 0,
    endFrame: 4,
    speed: 0.2
  },
  walk: {
    startFrame: 4,
    endFrame: 12,
    speed: 0.15
  },
  attack: {
    startFrame: 12,
    endFrame: 20,
    speed: 0.11
  },
  die: {
    startFrame: 20,
    endFrame: 28,
    speed: 0.2
  },
  shoot: {
    startFrame: 28,
    endFrame: 32,
    speed: 0.1
  }
};


let scene;

interface PlayerControls
{
  up: Input.Keyboard.Key,
  down: Input.Keyboard.Key,
  left: Input.Keyboard.Key,
  right: Input.Keyboard.Key
}

class Skeleton extends GameObjects.Sprite
{
  private startX: number;
  private startY: number;
  private readonly distance: number;

  private readonly speed: number;

  public controls: PlayerControls;

  constructor(scene, x = 240, y = 290, speed = 1, distance = 100)
  {
    super(scene, x, y, SPRITE_KEYS.skeleton);

    this.startX = x;
    this.startY = y;
    this.distance = distance;

    this.speed = speed;
    this.depth = y + 64;
  }

  update()
  {
    const controls = this.controls;
    let direction: MoveDirection | undefined;

    if (controls.up.isDown) direction = directions.north;
    else if (controls.down.isDown) direction = directions.south;

    if (controls.right.isDown)
    {
      if (direction) direction = direction === directions.north ? directions.northEast : directions.southEast;
      else direction = directions.east;
    }
    else if (controls.left.isDown)
    {
      if (direction) direction = direction === directions.north ? directions.northWest : directions.southWest;
      else direction = directions.west;
    }

    if (!direction) return;

    this.x += direction.x * this.speed;

    if (direction.y !== 0)
    {
      this.y += direction.y * this.speed;
      this.depth = this.y + 64;
    }
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
    this.load.spritesheet(SPRITE_KEYS.skeleton, images.skeleton8, { frameWidth: 128, frameHeight: 128 });
    this.load.image(SPRITE_KEYS.house, images.rem_0002);
  }

  create()
  {
    scene = this;

    this.buildMap();
    this.placeHouses();

    this.add.existing(this.player = new Skeleton(this, 240, 290, 10));

    this.cameras.main.setSize(1600, 600);
    this.fpsText = this.add.text(16, 16, "60 fps").setScrollFactor(0, 0);

    const keyboard = this.input.keyboard;

    this.cameraControls = keyboard.createCursorKeys();

    this.player.controls =
      {
        up: keyboard.addKey('W'),
        down: keyboard.addKey('S'),
        left: keyboard.addKey('A'),
        right: keyboard.addKey('D')
      };
  }

  update()
  {
    this.player.update();

    const controls = this.cameraControls;
    const scrollSpeed = 5;

    if (controls.right.isDown) this.cameras.main.scrollX += scrollSpeed;
    else if (controls.left.isDown) this.cameras.main.scrollX -= scrollSpeed;

    if (controls.up.isDown) this.cameras.main.scrollY -= scrollSpeed;
    else if (controls.down.isDown) this.cameras.main.scrollY += scrollSpeed;

    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} fps`);
  }


  buildMap()
  {
    //  Parse the data out of the map
    const data = scene.cache.json.get(MAP_KEY);
    const tileWidth = data.tilewidth, tileHeight = data.tileheight;

    const tileWidthHalf = tileWidth * .5;
    const tileHeightHalf = tileHeight * .5;

    const layer = data.layers[0].data;

    const mapWidth = data.layers[0].width, mapHeight = data.layers[0].height;

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
  width: 800,
  height: 600,
  backgroundColor: '#ABABAB',
  scene: [Example]
};

new Game(config);
