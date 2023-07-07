// =============
// SOUND
// =============

var start, pop1, pop2, pop3, swoosh, throw1, unsheath, bass, hurt, coin, collect, jump, potion, quack, shield, death, armor, explosion, throwGrenade, pin;

start = new sound("sound/start.m4a");
pop1 = new sound("sound/pop1.m4a");
pop2 = new sound("sound/pop2.m4a");
pop3 = new sound("sound/pop3.m4a");
swoosh = new sound("sound/swoosh.m4a");
throw1 = new sound("sound/throw.m4a");
unsheath = new sound("sound/unsheath.wav");
bass = new sound("sound/bass.m4a");
hurt = new sound("sound/hurt.m4a");
coin = new sound("sound/coin.wav");
collect = new sound("sound/collect.m4a");
jump = new sound("sound/jump.m4a");
potion = new sound("sound/potion.m4a");
quack = new sound("sound/quack.m4a");
shield = new sound("sound/shield.m4a");
death = new sound("sound/death.m4a");
armor = new sound("sound/armor.m4a");
explosion = new sound("sound/explosion.m4a");
throwGrenade = new sound("sound/throw-grenade.m4a");
pin = new sound("sound/pin.m4a");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//Random integer generator to randomize which sound is played
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}