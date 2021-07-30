const WIN_HEIGHT = 600, WIN_WIDTH = 800;

const SPRITE_KEYS =
  {
    skeleton: 'skeleton',
    house: 'house',
    tiles: 'tiles',
    zombie: 'zombie',
    fire: 'fire'
  };

const MAP_KEY = 'map';

//TODO: find way to use extension method without breaking the padding on simple-textbox.ts
/*declare global
{
  interface Array<T>
  {
    fastLoop(this: T[], action: (value: T) => void): void;
  }
}

Array.prototype.fastLoop = function <T>(this: T[], action: (value: T) => void)
{
  let length = this.length;
  while (length--) action(this[length]);
}*/

export
{
  WIN_HEIGHT, WIN_WIDTH,

  SPRITE_KEYS, MAP_KEY
}
