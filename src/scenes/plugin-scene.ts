import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

export class PluginScene extends Phaser.Scene
{
  public rexUI: RexUIPlugin;

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig)
  {
    super(config);
  }

}
