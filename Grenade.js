"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Grenade(descr) {
   this.setup(descr);

    this.sprite = g_sprites.grenadeLive;
};

Grenade.prototype = new Entity();

// Initial, inheritable, default values
Grenade.prototype.cx = 200;
Grenade.prototype.cy = 200;
Grenade.prototype.velX = 6;
Grenade.prototype.velY = -13;
Grenade.prototype.radius = 15;
Grenade.prototype.NOMINAL_GRAVITY = 0.5;
Grenade.prototype.lifespan = 2000 / NOMINAL_UPDATE_INTERVAL;
Grenade.prototype.explode = false;
Grenade.prototype.spriteCell = 0;
Grenade.prototype.animationLag = 5;
Grenade.prototype.left = true;
Grenade.prototype.isGrenade = true;

Grenade.prototype.update = function (du){

    spatialManager.unregister(this);
    if(this._isDeadNow){
        return   -1;
    }
    //Decrement lifespan by delta unit
    this.lifespan -= du;
    // if lifespan is over, set the explosion flag to true to trigger explosion animation
    if (this.lifespan < 0 ) {

        this.explode = true;
        entityManager.explosion = true;
        explosion.play();
        //Slow down the animation * animationLag times
        if(this.animationLag > 0) this.animationLag--;

        else{
            //If you get here, the lifespan is over. Switch sprite to the first cell of the explosion animation frame
            this.sprite = g_sprites_explosion[this.spriteCell];
            //Advance to next animation frame
            this.spriteCell++;
            //Once the animation reaches its last frame, request death of bubble
            if(this.spriteCell > g_sprites_explosion.length) return entityManager.KILL_ME_NOW;
         }
    }

    var accelY = Grenade.prototype.NOMINAL_GRAVITY*du;
    var accelX = 0;

    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;

    // Bounce from the left side
    if(nextX <= this.sprite.width/2){
        this.left = false;
        this.velX *= -1;
    }
    // Bounce from the right side
    if(nextX >= g_canvas.width-this.sprite.width/2){
        this.velX *= -1;
    }

    // Slow grenade down to zero, from both sides
    if(this.velX > 0){
        this.velX -= 0.1;
    }
    else if(this.velX < 0){
         this.velX += 0.1;
    }

    this.applyAccel(accelX,accelY,du);

    var hitEntity = this.findHitEntity();
    hitEntity = spatialManager.findEntityOnGrenade(this);

    //If there is an object(s) within explosion range, kill it and trigger explosion animation
    if (hitEntity){
        var canTakeHit = hitEntity.takeWireHit;
        if (canTakeHit) {
            canTakeHit.call(hitEntity);
            this.lifespan = -1;
            this.sprite = g_sprites_explosion[this.spriteCell];
        }
        //Once the explosion reaches the below size, request its death
        if(this.radius > 70){
            return entityManager.KILL_ME_NOW;
        }
        else{
            //Explosion range grows
            this.radius *= 2;
            }
    }
    //Check for death and re register
    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

Grenade.prototype.render = function (ctx) {
  this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};


Grenade.prototype.getRadius = function () {
    return this.radius;
};


// Makes the grenade bounce off ground and handles it's gravity.
// This function is mostly copy pasted from Patrick's code in entities/asteroids, 
Grenade.prototype.applyAccel = function (accelX, accelY, du) {

    if(this.left) this.velX = -5;

    var oldVelX = this.velX;
    var oldVelY = this.velY;

    this.velX += accelX * du;
    this.velY += accelY * du;

    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;

    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;

    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;

    // bounce

    var minY = this.radius/ 2;
    var maxY = 510 - minY;

    // Ignore the bounce if the grenade is already in
    // the "border zone" (to avoid trapping them there)
    if (this.cy > maxY || this.cy < minY) {
        // do nothing
    }
    else if (nextY > maxY) {
        this.velY = oldVelY * -0.6;
        intervalVelY = this.velY;
    }

    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Grenade.prototype.takeGrenadeHit = function () {
    this.kill();
};
