import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1250,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
		},
	},
	scene: [HelloWorldScene],
}

export default new Phaser.Game(config)
