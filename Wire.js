
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Wire(descr) {

        // Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = this.sprite || g_sprites.arrow;
    this.scale  = this.scale  || 0.5;

};
Wire.prototype = new Entity();
// Initial, inheritable, default values
Wire.prototype.velY = -6;
Wire.prototype.radius = 3;

Wire.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow){
        return -1;
    }

    if(g_wireVelToggle) {
      this.velY = -12;
    } else {
      this.velY = -6;
    }
    this.cy += this.velY*du;

    // If "wire" crosses top edge of canvas

    if (this.cy <= 0) {
        return entityManager.KILL_ME_NOW;
    }
    var hitEntity = this.findHitEntity();
    hitEntity = spatialManager.findEntityOverlapWire(this);
    if (hitEntity){
        var canTakeHit = hitEntity.takeWireHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        return entityManager.KILL_ME_NOW;
    }

    if(!this._isDeadNow){
         spatialManager.register(this);
    }

};

Wire.prototype.takeWireHit = function () {
    this.kill();
};


Wire.prototype.render = function (ctx) {


    //Draw the 'wire'

    ctx.beginPath();
	   ctx.moveTo(this.cx, this.cy);
    g_sprites.wire.drawAt(ctx, this.cx-5, this.cy+5);

     for (var i = this.cy; i < 475; i+= g_sprites.wire.height){
        g_sprites.wire.drawAt(ctx, this.cx-5, i);
    }
        //Draw the arrow
    var originalScale = this.sprite.scale;
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0, 0.25);

};
