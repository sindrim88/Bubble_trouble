/*
Values for the levels of the game
Can be modified to change velocity direction, time between bubbles,
amount of bubbles in each level and more.
*/

var x = g_canvas.width/4;
var posX = [x*1,x*2,x*3];

g_bubblesDescr = {
    1 : [
        {cx : posX[0]}
    ],

    2 : [
        {cx : posX[0]}, {cx : posX[2]}
    ],

    3 : [
        {cx : posX[0]}, {cx : posX[1]}, {cx : posX[2]}
    ]
}

g_waveTime = {
    1 : 2000,
    2 : 8000,
    3 : 8000,
    4 : 6000,
}

g_waves = {
    1 : 4,
    2 : 4,
    3 : 4,
    4 : 6,
}
