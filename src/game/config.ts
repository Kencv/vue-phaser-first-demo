import sky from "../assets/sky.png?url";
import platform from "../assets/platform.png?url";
import star from "../assets/star.png?url";
import bomb from "../assets/bomb.png?url";
import dude from "../assets/dude.png?url";

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300},
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
} as Phaser.Types.Core.GameConfig;

// 静态物理组
let platforms: Phaser.Physics.Arcade.StaticGroup;

// 玩家
let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

// 键盘控制
let cursors: Phaser.Types.Input.Keyboard.CursorKeys | any;

// 星星组
let stars: Phaser.Physics.Arcade.Group;

// 计数得分
let score = 0;
// 文字
let scoreText: Phaser.GameObjects.Text;

// 炸弹
let bombs: Phaser.Physics.Arcade.Group;


let gameOver = false;

function preload(this: Phaser.Scene) {
    console.log(this.load);

    this.load.image("sky", sky);
    this.load.image("ground", platform);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.spritesheet("dude", dude, {
        frameWidth: 32,
        frameHeight: 48,
    });
}

function create(this: Phaser.Scene, data: object) {
    // 设置背景
    this.add.image(400, 300, "sky");

    // 静态平台
    {
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, "ground").setScale(2).refreshBody();

        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");
    }

    // 生成玩家
    {
        player = this.physics.add.sprite(100, 450, "dude");

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{key: "dude", frame: 4}],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1,
        });

        // 玩家与静态平台碰撞
        this.physics.add.collider(player, platforms);
    }

    // 获取键盘监听
    if (this.input?.keyboard) {
        cursors = this.input.keyboard.createCursorKeys();
    } else {
        cursors = null;
    }

    // 设置得分星星
    {
        stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70},
        });

        stars.children.iterate(function (child) {
            // @ts-ignore
            return child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        // 添加积分板
        // @ts-ignore
        scoreText = this.add.text(16, 16, '得分: 0', {fontSize: '32px', fill: '#000'});
        // 星星与静态平台碰撞
        this.physics.add.collider(stars, platforms);
        // 星星碰撞玩家
        this.physics.add.overlap(player, stars, (player, star) => {
            // @ts-ignore
            // 星星消失
            star.disableBody(true, true);
            score += 10;
            scoreText.setText('得分: ' + score);
            if (stars.countActive(true) === 0)
            {
                // @ts-ignore
                stars.children.iterate(function (child) {

                    // @ts-ignore
                    child.enableBody(true, child.x, 0, true, true);

                });

                // @ts-ignore
                let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                let bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

            }
        }, null as any, this);
    }

    // 炸弹
    {
        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, (player, bomb) => {
                this.physics.pause();

                // @ts-ignore
                player.setTint(0xff0000);

                // @ts-ignore
                player.anims.play('turn');

                gameOver = true;
            }
            ,
            null as any, this
        )
        ;
    }
}

// 无限循环
function update(this: Phaser.Scene, time: number, delta: number) {
    if (gameOver) {
        return;
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);

        player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
