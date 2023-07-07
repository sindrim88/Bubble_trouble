/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    var id = this._nextSpatialID;
    this._nextSpatialID += 1;
    return id;
},

reset : function (){
    this._nextSpatialID = 1;
    this._entities.length = 0;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    entity['posX'] = pos['posX'];
    entity['posY'] = pos['posY'];
    entity['spatialID'] = entity.getSpatialID();
    entity['radius'] = entity.getRadius();
    this._entities[spatialID] = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID];
},

// Regular collision check, find in range
findEntityInRange: function(posX, posY, radius) {
    var entity;
    for (var ID in this._entities) {
        var e = this._entities[ID];
        var insideRange = util.distSq(posX, posY, e.posX, e.posY) < util.square(e.radius + radius)
        if (insideRange) {
            entity = e;
        }
    }
    return entity;
},

// Special collision check for wires
findEntityOverlapWire(wire) {
    var halfwidth = wire.getRadius()/2;
    var entity, pos, posX, posY, radius;
    var bubbles = entityManager.getBubbles();
    for (var i = 0; i<bubbles.length; i += 1) {
        var e = bubbles[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();
        if(posX + radius >= wire.cx - halfwidth && posX - radius <= wire.cx - halfwidth){
            if(posY <= g_groundEdge && posY >= wire.cy + wire.radius) entity = e;
        }
        else if(posX + radius >= wire.cx + halfwidth && posX - radius <= wire.cx +halfwidth) {
            if(posY <= g_groundEdge && posY >= wire.cy + wire.radius) entity = e;
        }
    }
    return entity;
},

//Special collision check for sword mode
findEntityOnSword(cx, cy, width, height, frame){
    var x1, x2, y1, y2;
    var entity, pos, posX, posY, radius;
    var bubbles = entityManager.getBubbles();

    // In the animation sequence, only frame 1 and 2 include the sword 
    // Therefore only those frames require collision checks
    if(frame === 0 || frame === 3) return;

    if(frame === 1){
        // Since the sword is a different size in the two frames, use exact locations calulated in photoshop
        x1 = cx - width/2 + 83;
        y1 = cy - height/2 + 10;
        x2 = cx - width/2 + 246;
        y2 = cy - height/2 +58;
    }
    else {
        x1 = cx - width/2 + 2;
        y1 = cy - height/2 + 34;
        x2 = cx - width/2 + 239;
        y2 = cy - height/2 + 115;
    }

    for (var i = 0; i<bubbles.length; i += 1) {
        var e = bubbles[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();

        // Circle and rectangle collision check
        if(posX + radius >= x1 && posX - radius <= x2){
            if(posY + radius <= y2 && posY - radius >= y1) entity = e;
        }

    }
    return entity;
},

// Special collision check for grenades
findEntityOnGrenade(Grenade) {
    var halfwidth = Grenade.sprite.width;
    var entity, pos, posX, posY, radius;
    var bubbles = entityManager.getBubbles();
    for (var i = 0; i<bubbles.length; i += 1) {
        var e = bubbles[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();
        var insideRange = util.distSq(Grenade.cx, Grenade.cy, e.posX, e.posY) < util.square(e.radius + halfwidth);
        if (insideRange) {
            entity = e;
        }
    }
    return entity;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    // Special drawing for the "tail" of the wire
    var wires = entityManager.getWires();
    for (var i = 0; i<wires.length; i += 1) {
        var wire = wires[i];
        var halfwidth = wire.getRadius()/2;
        ctx.rect(wire.cx - halfwidth, wire.cy, halfwidth*2, g_groundEdge-wire.cy);
        ctx.stroke();
    }
    ctx.strokeStyle = oldStyle;
}
}
