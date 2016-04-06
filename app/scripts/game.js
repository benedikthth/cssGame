
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.isPlaying = false;
		this.sound = true;
		this.audioPacks = {
			normal: {
				flap: new Audio('/audio/n_flap.mp3'),
				score: new Audio('/audio/n_score.mp3'),
				death: new Audio('/audio/n_death.mp3'),
				bg: new Audio('/audio/n_bg.mp3')
			},
			dMode: {
				flap: new Audio('/audio/d_flap.mp3'),
				score: new Audio('/audio/d_score.mp3'),
				death: new Audio('/audio/d_death.mp3'),
				bg: new Audio('/audio/d_bg.mp3')
			},
			bMode: {
				flap: new Audio('/audio/b_flap.mp3'),
				score: new Audio('/audio/b_score.mp3'),
				death: new Audio('/audio/b_death.mp3'),
				bg: new Audio('/audio/b_bg.mp3')
			}
		};
		this.UsedAudio = this.audioPacks.normal;
		/*find all three pipes.!*/
		this.pipes = [
			new window.Pipe(this.el.find('#pipeOne'), this.player, this)
		];

		/*allow muting through game-object */
		var that = this;
		var muteBtn = this.el.find('#muter');
		muteBtn.on('click', function(){
			if(that.sound){
				//gets muted.
				this.classList.add('muted');
				that.UsedAudio.bg.pause();
				that.UsedAudio.bg.currentTime = 0;
				that.sound = false;
			} else {
				this.classList.remove('muted');
				that.sound = true;
			}
		});


		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		for (var i = 0; i < this.pipes.length; i++) {
			this.pipes[i].onFrame(delta);
		}
		if(this.sound){
			this.UsedAudio.bg.play();
		}
		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		this.pipes[0].initialize();
	};


	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		if(this.sound){
			this.UsedAudio.death.play();
		}
		this.isPlaying = false;



		// Should be refactored into a Scoreboard class.
		var that = this;




		document.getElementById('scoreShow').innerHTML = this.player.score;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function(el) {
					var pauseAndReset = function(song){
						song.pause();
						song.currentTime = 0;
					};
					switch (el.toElement.innerHTML) {
						case 'Restart':
							pauseAndReset(that.UsedAudio.bg);
							pauseAndReset(that.UsedAudio.death);
							that.UsedAudio = that.audioPacks.normal;
							that.player.el[0].classList.add('normal');
							that.player.el[0].classList.remove('badBoy');
							that.player.el[0].classList.remove('special');
							break;
						case 'D mode':
							pauseAndReset(that.UsedAudio.bg);
							pauseAndReset(that.UsedAudio.death);
							that.UsedAudio = that.audioPacks.dMode;
							that.player.el[0].classList.add('special');
							that.player.el[0].classList.remove('badBoy');
							that.player.el[0].classList.remove('normal');
							break;
						default:

							pauseAndReset(that.UsedAudio.bg);
							pauseAndReset(that.UsedAudio.death);
							that.UsedAudio = that.audioPacks.bMode;
							that.player.el[0].classList.add('badBoy');
							that.player.el[0].classList.remove('normal');
							that.player.el[0].classList.remove('special');
							break;

					}
					scoreboardEl.removeClass('is-visible');
					if(that.sound){
						that.UsedAudio.death.pause();
						that.UsedAudio.death.currentTime = 0;
					}
					that.start();
				});
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();
