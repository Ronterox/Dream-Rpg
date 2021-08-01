import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

//TODO: vector class
//But is okay to use something simple like interface here
interface IPosition
{
  x: number,
  y: number
}

export
{
  //FRAMEWORK
  TextStyle,
  CursorKeys,

  //MINE
  IPosition
}
