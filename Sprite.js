// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// Construct a "sprite" from the given `image`,
//
function Sprite(image, sx, sy, width, height, offsetX, offsetY) {
    if(offsetX === undefined) offsetX = 0;
    if(offsetY === undefined) offsetY = 0;

    if(sx === undefined || sy === undefined){
        sx = 0;
        sy = 0;
    }

    this.image = image;

    this.sx = sx;
    this.sy = sy;

    this.offsetX = offsetX;
    this.offsetY = offsetY;

    if(width === undefined || height === undefined){
        this.width = image.width;
        this.height = image.height;
    }

    else {
    this.width = width;
    this.height = height;
    }
    this.scale = 1;
};

Sprite.prototype.drawAt = function (ctx, x, y, rotation) {
    if(rotation === undefined) rotation = 0;
     ctx.drawImage(this.image,
                  this.sx, this.sy, this.width, this.height,
                  x, y, this.width, this.height);

};

Sprite.prototype.drawSpriteAt = function (ctx, x, y, scale, player) {

    ctx.save();

    if(player){
        ctx.scale(scale, scale);
        ctx.translate(x,y);
    }
    else {
        ctx.scale(-scale, scale);
        ctx.translate(-x*3,y);
    }
    ctx.drawImage(this.image,
                  this.sx, this.sy, this.width, this.height,
                  x - this.width/2 + this.offsetX, y - this.height/2 +this.offsetY, this.width, this.height);
    ctx.restore();
};



Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation, scale, player) {
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;
    if (this.sx === undefined) this.sx = 0;
    if (this.sy === undefined) this.sy = 0;
    if (this.offsetX === undefined) this.offsetX = 0;
    if (this.offsetY === undefined) this.offsetY = 0;

    var w = this.width,
        h = this.height;

    // If player is defined, Player is calling the function.
    // In this case, draw the current frame of the animation
    // This requires accessing the offsets and checking which direction he is going in

    if(player !== undefined){  
        ctx.save();

        if(player){
            ctx.scale(scale, scale);
            ctx.translate(cx,cy);
        }
        else {
            ctx.scale(-scale, scale);
            ctx.translate(-cx*3,cy);
        }
        ctx.drawImage(this.image,
                      this.sx, this.sy, this.width, this.height,
                      cx - this.width/2 + this.offsetX, cy - this.height/2 +this.offsetY, this.width, this.height);
        ctx.restore();
    } 

    // Otherwise if player was undefined, the function was called by something requiring one of the simple sprites
    // Eg a bubble, wire, powerup
    // In this case, just draw that sprite (no clipping of a sprite sheet requred)

    else {
        if (rotation === undefined) rotation = 0;

        var w = this.width,
            h = this.height;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.scale(this.scale, this.scale);

        // drawImage expects "top-left" coords, so we offset our destination
        // coords accordingly, to draw our sprite centred at the origin
        ctx.drawImage(this.image,
                      -w/2, -h/2);

        ctx.restore();
    }

    ctx.restore();
};
