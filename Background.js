"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Background(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    // Default sprite and scale, if not otherwise specified
    this.scale  = this.scale  || 1;
}

Background.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Background.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Background.prototype.KEY_BACKGROUND = 'B'.charCodeAt(0);

// Initial, inheritable, default values
Background.prototype.cx = 0;
Background.prototype.backgroundMode = 1;

Background.prototype.update = function (du) {
    //Update x coord for parallax, but only if the player is moving
    if(entityManager._players[0].move) {
        if (keys[this.KEY_LEFT]) {
            this.cx -= 2.5*du;
        } else if (keys[this.KEY_RIGHT]) {
            this.cx += 2.5*du;
        }
    }
};

Background.prototype.render = function (ctx) {

    var cx = this.cx;

    util.clearCanvas(ctx);

    //Background 1: Industrial
    if(this.level === 1){
        //Scale the artwork to fill the screen with leeway for panning
        //With each layer, translate farther to compound the pan and achieve parallax
        ctx.save();
        ctx.scale(4, 4);
        ctx.translate(cx/60, 0);
        g_sprites.bgkIndustrial1.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bgkIndustrial2.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bgkIndustrial3.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bgkIndustrial4.drawAt(ctx, -50, 22);

        ctx.restore();
    }
    //Background 2: Bulkhead
    else if(this.level === 2) {

        ctx.save();
        ctx.scale(2.75, 2.75);
        ctx.translate(cx/60, 0);
        g_sprites.bgkBulkhead1.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bgkBulkhead2.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bgkBulkhead3.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bgkBulkhead4.drawAt(ctx, -50, 0);

        ctx.restore();
    }

    //Background 3: Underwater
    else {
        ctx.save();
        ctx.scale(3.25,3.25);
        ctx.translate(cx/60, 0);
        g_sprites.bkgUnderwater1.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bkgUnderwater2.drawAt(ctx, -50, 0);
        ctx.translate(cx/60, 0);
        g_sprites.bkgUnderwater3.drawAt(ctx, -50, 0);
        ctx.restore();
    }

    //Draw the spikes - just repeat the arrow sprite, rotated 180 degrees
    for(var i=0; i< 650; i+=g_sprites.spike.width){
        ctx.beginPath();
        ctx.save();
        ctx.scale(1, 1);
        g_sprites.spike.drawCentredAt(ctx, i, 0, 3.14);
        ctx.restore();
    }
};
