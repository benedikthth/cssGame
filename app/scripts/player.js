window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;
	var jumpPower = 0.7;
	var Player = function(el, game) {
		this.mxYspeed = 1;
		this.el = el;
		this.game = game;
		this.score = 0;
		this.pos = { x: 0, y: 0 };
		this.yspeed = 0;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.score = 0;
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
	};
//delta was in the parameters
	Player.prototype.onFrame = function() {



		if(Controls.didJump()){
			if(this.game.sound){
				this.game.UsedAudio.flap.cloneNode(true).play();
			}
			this.yspeed = -jumpPower;
		} else if(this.yspeed > this.mxYspeed){
			this.yspeed = this.mxYspeed;
		} else {
			this.yspeed+=0.05;
		}
		if(this.yspeed > this.mxYspeed){
			this.yspeed = this.mxYspeed;
		}
		this.pos.y += this.yspeed;
		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate('+ (Math.atan(this.yspeed/4))*180/Math.PI+'deg)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT + 3 > this.game.WORLD_HEIGHT) {
			this.yspeed = 0;
			return this.game.gameover();
		}
	};

	return Player;

})();
