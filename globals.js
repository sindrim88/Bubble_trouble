// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_groundEdge;
var g_timeOuts;
var g_powerUpTimeOuts;
var g_playerIsDead = false;
var g_bubblesDescr;
var g_wireVelToggle = false;
var g_shield = false;
var g_sword = false;
var g_eWires = false;
var g_grenades = 1;
var g_addBubbleTime;
var g_waves;
var g_level = 1;
var g_numberOfWaves;

var g_allowMixedActions = true;
var g_sauronEye = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
var g_bricks = true;

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;
