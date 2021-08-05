import { SimpleDialogue, SimpleTextBox } from "../gameobjects/ui/ui-gameobjects-components";

function enable(obj: Phaser.GameObjects.Image | Phaser.Physics.Arcade.Sprite | SimpleTextBox | SimpleDialogue, value = true)
{
  obj.setActive(value);
  obj.setVisible(value);
}

export
{
  enable
}
