import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	private platform?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	private stars?: Phaser.Physics.Arcade.Group
	private score = 0
	private scoreText?: Phaser.GameObjects.Text
	private bomb? :Phaser.Physics.Arcade.Image
	private gameOver = false
	constructor() {
		super('hello-world')
	}
	preload() {
		this.load.image('sky', 'assets/sky.png')
		this.load.image('ground', 'assets/platform.png')
		this.load.image('star', 'assets/meat1.png')
		this.load.image('bomb', 'assets/bomb.png')
		this.load.image('orange', 'assets/orange.png')
		this.load.spritesheet('dude','assets/Redo.png', {frameWidth: 59, frameHeight: 48})
	}
	create() {
		this.add.image(800,300,'orange')
		this.add.image(0,300,'orange')

		this.platform = this.physics.add.staticGroup()
		const ground = this.platform.create(400,568, 'ground') as Phaser.Physics.Arcade.Sprite
		ground
		.setScale(2)
		.refreshBody()

		const newGround = this.platform.create(1000,568, 'ground') as Phaser.Physics.Arcade.Sprite
		newGround
		.setScale(2)
		.refreshBody()
		this.platform.create(600,400,'ground')
		this.platform.create(50,250,'ground')
		this.platform.create(750,220,'ground')

		this.player = this.physics.add.sprite(100,450,'dude')
		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 4, end: 6
			}),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'turn',
			frames: [{key: 'dude', frame: 7}],
			frameRate: 20
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0, end: 3
			}),
			frameRate: 10,
			repeat: -1
		})

		this.physics.add.collider(this.player, this.platform)

		this.cursors = this.input.keyboard.createCursorKeys()

		this.stars = this.physics.add.group({
			key: 'star',
			setScale: { x: 0.6, y: 0.6},
			repeat: 11,
			setXY: {x: 12, y: 0, stepX: 70}
		})
		this.stars.children.iterate(c => {
			const child = c as Phaser.Physics.Arcade.Image
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		this.physics.add.collider(this.stars, this.platform)
		this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this)

		this.scoreText = this.add.text(16,16,'Score: 0', {
			fontSize: '32px',
			color: '#000'
		})

		this.bomb = this.physics.add.image(Phaser.Math.FloatBetween(0,800),10,'bomb')

		this.physics.add.collider(this.bomb, this.platform)
		this.physics.add.overlap(this.player, this.bomb, this.handleCollectBomb, undefined, this)
		this.bomb.setBounceY(Phaser.Math.FloatBetween(0.6, 1.0))
	}

	private handleCollectStar(player: Phaser.GameObjects, s: Phaser.GameObjects.GameObject) {
		const star = s as Phaser.Physics.Arcade.Image
		star.disableBody(true, true)

		this.score += 10
		this.scoreText?.setText(`Score: ${this.score}`)

		if (this.stars?.countActive(true)===0) {
			this.bomb?.enableBody(true, Phaser.Math.FloatBetween(0,800), 0, true,true)
			this.stars.children.iterate (c => {
				const child = c as Phaser.Physics.Arcade.Image
				child.enableBody(true, child.x, 0, true, true)
				
			})
		}
	}
	private handleCollectBomb(player: Phaser.GameObjects) {

		this.scoreText?.setText('Game Over You Lose')
		this.physics.pause()
		this.player?.setTint(0xff0000)
		this.player?.anims.play('turn')

		this.gameOver = true
	}
	update() {
		if (!this.cursors) {
			return
		}
		if (this.cursors.left?.isDown) {
			this.player?.setVelocityX(-160)
			this.player?.anims.play('left', true)
		}
		else if(this.cursors.right?.isDown){
			this.player?.setVelocityX(160)
			this.player?.anims.play('right', true)
		}
		else {
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn')
		}

		if (this.cursors.up?.isDown && this.player?.body.touching.down) {
			this.player.setVelocityY(-330)
		}

		if (this.score === 360) {
			this.scoreText?.setText('Game Over You Win')
			this.physics.pause()
		}


	}
}