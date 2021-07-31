// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { GameObjects, Skeleton} from "./gameobjects-components";
// noinspection ES6PreferShortImport
import { Scene } from "../scenes/scenes-components";
// noinspection ES6PreferShortImport
import { IPosition, TextStyle } from "../scripts/scripts-components";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class Zombie extends Phaser.Physics.Arcade.Sprite
{
  private readonly speed: number;
  //TODO: obviously generalize this player with a tag
  public player: Skeleton;
  //TODO: Where is max health dude, and everything else about the defense/dodging etc
  private _health: number = 100;
  private damageText: GameObjects.Text;

  constructor(scene: Scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.zombie);
    this.name = "Zombie";
    this.speed = speed;

    this.setDepth(y + 64).setInteractive().input.hitArea.setTo(this.width * .25, this.height * .25, 60, 60);
    this.setTint(0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00);

    this.damageText = scene.add.text(this.x, this.y, '', { fontSize: '35px', fill: 'red' } as TextStyle);

    this.on('pointerdown', () =>
    {
      if (this.body.touching)
      {
        //TODO: check if player is on collision with tag/name
        const { x: playerX, y: playerY, width: playerWidth } = this.player;
        if (Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY) < playerWidth)
        {
          const damage = Phaser.Math.Between(25, 50);
          this.takeDamage(this.player, damage);
        }
      }
    });

    scene.add.existing(this);
  }

  public takeDamage(damagerPosition: IPosition, damage: number)
  {
    const { x: damagerX, y: damagerY } = damagerPosition;

    //TODO: this should be the enemy weapon
    const knockbackForce = 2;
    this.setDrag(0.1);
    this.setDamping(true);
    this.setVelocity((this.x - damagerX) * knockbackForce, (this.y - damagerY) * knockbackForce);

    this._health -= damage;

    //TODO: tween an animation
    this.damageText.setPosition(this.x, this.y);
    this.damageText.setText(`-${damage}`);
    this.damageText.setDepth(this.y * 2);

    const camera = this.scene.cameras.main;
    if (this._health <= 0)
    {
      //TODO: Create disable method for all gameobjects
      camera.flash(100);
      this.destroy();
    }

    camera.shake(100);
  }

  public setCollider()
  {
    const height = this.width * .5;
    this.setSize(this.width * .25, height);
    this.setImmovable();
  }
}
