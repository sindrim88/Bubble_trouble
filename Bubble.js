"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Bubble(descr) {
        // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = this.sprite || g_sprites.bubble;
    this.scale  = this.scale  || 1;
};

Bubble.prototype = new Entity();
// Initial, inheritable, default values
var KEY_GRAVITY = keyCode('G');

Bubble.prototype.cx = 150;
Bubble.prototype.cy = 80;
Bubble.prototype.radius = 30;
Bubble.prototype.velX = -2;
Bubble.prototype.velY = 0.5;
Bubble.prototype.orbit = false;
Bubble.prototype.NOMINAL_GRAVITY = 0.12;
Bubble.prototype.popped = false;
Bubble.prototype.spriteCell = 0;
Bubble.prototype.animationLag = 3;


Bubble.prototype.update = function (du) {
    spatialManager.unregister(this);
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;


    // Simple collision detection to keep the bubbles inside the canvas
    // Bounce from ground
    if(nextY > g_groundEdge - this.radius/2){
        this.velY *= -1;
    }
    // Bounce from left side
    if(nextX <= this.radius/2){
        this.velX *= -1;
    }
    // Bounce from right side
    if(nextX >= g_canvas.width-this.radius/2){
        this.velX *= -1;
    }
    // If bubble hits the roof.
    if(nextY <= this.radius*2){
      // Do not pop if in orbit
        if(Bubble.orbit){
        }
    else{
      // Pop the bubble if it hits the roof and not in orbit
      // change direction to raise points only once when hitting roof
        this.velY *= -1;
        scores.raisePoints();
        this.popped = true;
        }
    }

    // Collision check on bricks
    this.collisonOnBrick(nextY);

    Bubble.orbit =  g_sauronEye;

    // If orbit is on, set gravity orbit on
    if(Bubble.orbit){
        this.gravityOn();
    }
    // Otherwise have regular gravity
    else{
        var accelY = this.NOMINAL_GRAVITY*du;
        this.applyAccel(accelY, du);
    }

    // Pop the bubble if it is popped
    if(this.popped) this.spriteUpdate();

    // If it isn't popped, register it
    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

var pow;
// Make a powerup fall from the bubble in 20% of the cases
// Powerup is chosen at random
Bubble.prototype.isItPowerup = function(){
    pow = util.randRange(1, 1000);
     if(pow > 800){
        entityManager.generatePowerUp({
            cx : this.cx,
            cy : this.cy,
            powerUpId : Math.floor(Math.random()*8),
        });
    }
}

// If the bubble is hit with a wire, check for powerUp
// Pop the bubble in two if it's not the smallest size already
Bubble.prototype.takeWireHit = function (pow) {
    if(!this.popped){
        this.isItPowerup();
        this.popped = true;
        scores.raisePoints();
        if (this.scale === 1) pop1.play();
        if (this.scale === 0.25) pop3.play();
        if (this.scale > 0.25) {
            this._spawnFragment();
            this._spawnFragment();
            if(this.scale === 0.5) pop2.play();
        }
    }
};

// Create two bubbles, half the size of the bubble popped
Bubble.prototype._spawnFragment = function () {
    this.velX *= -1;

    entityManager.generateBubble({
        cx : this.cx,
        cy : this.cy,
        scale: this.scale/2,
        radius: this.radius*this.scale/2,
        velX : this.velX*0.8,
        velY : -5.5
    });
};

Bubble.prototype.getRadius = function () {
    return this.radius;
};

Bubble.prototype.applyAccel = function(accelY, du) {
    var oldVelY = this.velY;

    this.velY += accelY * du;

    var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
}

Bubble.prototype.render = function (ctx) {

    this.sprite.scale = this.scale;
    if(!this.popped) this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
    else {
        this.scale = 0.5;
        this.sprite.drawCentredAt(
          ctx, this.cx, this.cy, this.rotation, this.scale, this
        );
    }
};

// planetX/Y - the black hole - eye of sauron
var planetX = 300;
var planetY = 200;
Bubble.prototype.earthSpeed = 0.02;
Bubble.prototype.earthRadians = 20;
Bubble.prototype.dist = 220;

// Turning on gravity
Bubble.prototype.gravityOn = function(){
    if(this.earthRadians < (Math.PI * 2)){
        this.earthRadians += this.earthSpeed;
    }
    else{
        this.earthRadians = 0;
    }
    this.setEarthPosition();
}

Bubble.prototype.collisonOnBrick = function(nextY) {
    if(g_bricks) {
        var brickheight = 40;
        var brickwidth = 60;
        // Bricks are like "slimy" bricks, dont change only the direction of velocity
        for(var n = 0; n < entityManager._bricks.length; n++){
                var temp = entityManager._bricks[n].cy;
                // Collision check on top of bricks
                if((nextY + 30 > entityManager._bricks[n].cy &&
                nextY + 30 < entityManager._bricks[n].cy + brickheight) &&

                    ((this.cx - 20 > entityManager._bricks[n].cx &&
                        this.cx - 20 < entityManager._bricks[n].cx + brickwidth)||
                    (this.cx + 20 > entityManager._bricks[n].cx &&
                        this.cx + 20 < entityManager._bricks[n].cx + brickwidth))){
                    this.velY = -4;
                    return;
                }

                // Collision check on bottom of bricks
                else if((nextY - 30 < entityManager._bricks[n].cy + 40 &&
                nextY - 30 > entityManager._bricks[n].cy) &&

                    ((this.cx + 20 > entityManager._bricks[n].cx &&
                    this.cx - 20 < entityManager._bricks[n].cx + 60))){
                    this.velY = 4;
                    return;
                }

                //Bricks on left collision
                else if(this.cx - 20 < entityManager._bricks[n].cx + 60 && this.cx + 20 > entityManager._bricks[n].cx + 60){

                    if((this.cy + 20 >= entityManager._bricks[n].cy &&
                        this.cy - 20 <  entityManager._bricks[n].cy) ||

                        (this.cy + 20 >= entityManager._bricks[n].cy+40 &&
                        this.cy - 20 < entityManager._bricks[n].cy+40)){

                        this.velX *= -1;
                        return;
                    }
                }

                // Bricks on right colision
                else if(this.cx + 20 > entityManager._bricks[n].cx  && this.cx < entityManager._bricks[n].cx){

                    if((this.cy + 20 >= entityManager._bricks[n].cy &&
                        this.cy - 20 <  entityManager._bricks[n].cy) ||

                        (this.cy + 20 >= entityManager._bricks[n].cy+40 &&
                        this.cy - 20 < entityManager._bricks[n].cy+40)){

                        this.velX *= -1;
                        return;
                    }
                }
            }
        }
}

//Make the bubbles orbit like earths/planets around the black hole (PlanetX/Y)
Bubble.prototype.setEarthPosition = function(){

    //find next cx/cy coordinates of the orbit
    this.cx = planetX + Math.cos(this.earthRadians) * this.dist;
    this.cy = planetY + Math.sin(this.earthRadians) * this.dist;

    // increase speed and reduce distance to black hole if bubbles are popped.
    if(this.scale === 1){
        this.cx += 25;
    }
    else if(this.scale === 0.5){
        this.earthSpeed = 0.05;
    }
    else if(this.scale === 0.25){
        this.earthSpeed = 0.1;
        this.dist = 80;
    }
}


Bubble.prototype.spriteUpdate = function () {
    this.sprite = g_sprite_cycles[7][this.spriteCell];

    //Manage the speed
    if(this.animationLag > 0) this.animationLag--;

    else {
        //Go to next frame of sprite animation after each passage of given duration
        ++this.spriteCell;
        this.animationLag = 5;

        if (this.spriteCell === g_sprite_cycles[7].length){
            //If sprite is in death animation cycle, kill once he reaches the end of the animation.
            return this.kill();
        }
    }
}
