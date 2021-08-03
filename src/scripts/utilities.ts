import { SimpleDialogue, SimpleTextBox } from "../gameobjects/ui/ui-gameobjects-components";

function disable(obj: Phaser.GameObjects.Image | Phaser.Physics.Arcade.Sprite | SimpleTextBox | SimpleDialogue, value = false)
{
  obj.setActive(value);
  obj.setVisible(value);
}

export
{
  disable
}
