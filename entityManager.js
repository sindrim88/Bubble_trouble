/*

entityManager.js

A module which handles arbitrary entity-management for "Bubble-Trouble"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_backgrounds : [],
_Wires : [],
_players  : [],
_bullets : [],
_ground : [],
_bubbles : [],
_bricks : [],
_scores : [],
_power : [],
_grenade: [],

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,
// A counter to specify the duration of tremors when a grenade explodes
COUNTER : 20,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._backgrounds, this._bricks, this._bullets, this._Wires, this._players, this._ground, this._bubbles, this._scores, this._power, this._grenade];
},

init: function() {
},

makeGrenade: function(cx,cy,radius, left){
    this._grenade.push(
            new Grenade({
                cx: cx,
                cy: cy,
                radius: radius,
                left: left
            })
    );
},

// A flag to tell when to shake the entire screen to create an explosion effect
explosion: false,

fire: function(cx, cy) {
    this._categories[3].push(
        new Wire({
            cx,
            cy: cy - 40,
        })
    );
},

generateBackground : function (level) {

   var background = new Background({
       level,
   });
   this._backgrounds.push(background);

},

generatePlayer : function(cx, ground_edge) {
    var player = new Player();
    var cy = ground_edge - player.getRadius();
    this._players.push(new Player({
        cx,
        cy,
    }))
},

generateGround : function(cx,cy, halfWidth,halfHeight) {
    this._ground.push(
        new Ground({
            cx,
            cy,
            halfWidth,
            halfHeight,
        }));
    return cy + halfHeight;
},

generateScores : function(descr) {
  this._scores.push(new scores(descr));
},

generateBubble : function(descr, g_mouseX, g_mouseY) {
    var entity = new Bubble(descr);
    this._categories[6].push(entity);
},

addBubble : function(bubble) {
    this._categories[6].push(bubble);
},

// Used to detect whether player has finished the level
noBubblesOnScreen : function() {
    return this._categories[6].length === 0;
},

brick : function(cx, cy) {
   this._bricks.push(
        new Brick({
            cx,
            cy,
        })
    );
},

generatePowerUp : function(cx, cy) {
    var entity = new powerUp(cx, cy);
    this._categories[8].push(entity);
},

getBubbles : function() {
    return this._categories[6];
},

getWires : function() {
    return this._categories[3];
},

getPlayers : function() {
    return this._categories[4]
},

reset : function() {
    this._backgrounds = [];
    this._Wires = [];
    this._players = [];
    this._bullets = [];
    this._ground = [];
    this._bubbles = [];
    this._bricks = [];
    this._scores = [];
    this._power = [];
    this._grenade = [];
    entityManager.deferredSetup();
},


update: function(du) {
  //For shaking screen on explosion
  if(this.explosion){

    if(this.COUNTER > 0){
      //Just translate everything by a random number on every frame for the duration of the counter
      ctx.save();
      var dx = Math.random()*10;
      var dy = Math.random()*10;
      ctx.translate(dx, dy);

      this.COUNTER--;
    }
    else {
      this.explosion = false;
      this.COUNTER = 20;
    }
  }


  for (var c = 0; c < this._categories.length; ++c) {
      var aCategory = this._categories[c];
      var i = 0;

      while (i < aCategory.length) {

          var status = aCategory[i].update(du);

          if (status === this.KILL_ME_NOW) {
              // remove the dead guy, and shuffle the others down to
              // prevent a confusing gap from appearing in the array
              aCategory.splice(i,1);
          }
          else {
              ++i;
          }
      }
    }

},

render: function(ctx) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);

        }
    }
    //Restore if shaking screen during grenade explosion
    if(this.explosion){
      ctx.restore();
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
