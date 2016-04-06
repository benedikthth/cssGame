window.Pipe = (function(){
  'use strict';
  var Pipe = function(el, player, game) {
    this.player = player;
    this.game = game;
    this.el = el[0];
    this.segs = this.el.childNodes;
    this.dangerZone = player.pos.x;
    this.speed = 15;
    this.initialize();
  };
  Pipe.prototype.onFrame = function(delta){
    //if( this.x < this.player.pos.x + 5)  {
    if( this.x < this.player.pos.x + 5  && this.x > this.player.pos.x -6 )  {
      this.player.el[0].classList.add('scared');
      this.checkCollisionWithPlayer();
      this.canscore = true;
    }else {
      this.player.el[0].classList.remove('scared');
      if(this.canscore){
        this.canscore = false;
        if(this.game.sound){
          this.game.UsedAudio.score.cloneNode(true).play();
        }
        this.player.score ++;
      }
    }

    if(this.x < -10){
      this.initialize();
    }
    this.x -= (delta * this.speed);
    var transform = 'translate3d(' + this.x + 'em, ' + 0 + 'em, 0)';
    this.el.style.transform = transform;
  };

  Pipe.prototype.initialize = function () {

    this.x = 100;
    this.y = Math.floor(( Math.random() * 20) + 5);
    this.canscore=false;
    this.segs[1].style.height =  this.y + 'em';

  };

  Pipe.prototype.checkCollisionWithPlayer = function(){
    if(this.player.pos.y > 14+this.y || this.player.pos.y-5 < this.y)
    {this.game.gameover(); }
  };
  return Pipe;
})();
