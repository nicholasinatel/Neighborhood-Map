// canvas = document.getElementById("canvas");
// ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// setInterval(mainLoop, 200);

// function mainLoop(){
//   canvas.width = window.innerWidth/4;
//   canvas.height = window.innerHeight;

// //   var randomBlue = Math.floor(Math.random()*10);
//   for(i = 0.1; i < canvas.width; i+= 5)
//     {
//       ctx.moveTo(i, Math.floor( Math.random() * canvas.height));
//       ctx.lineTo(i, Math.floor(Math.random() * canvas.width));
//     }
//   ctx.fillStyle = "#191919";
//   ctx.fillRect(0,0,canvas.width,canvas.height);
//   ctx.strokeStyle = "#00EAD1" ;
//   ctx.stroke();
// }

canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');
var w = window.innerWidth;
var h = window.innerHeight;

ctx.strokeStyle = 'rgba(0,0,0,1)';
ctx.lineWidth = 10;
ctx.lineCap = 'butt';

var init = [];
var maxParts = 100;

for (var a = 0; a < maxParts; a++) {
    init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 8 + 2,
        ys: Math.random() * 5 + 5
    })
}

var particles = [];
for (var b = 0; b < maxParts; b++) {
    particles[b] = init[b];
}

function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var c = 0; c < particles.length; c++) {
        var p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
    }
    move();
}

function move() {
    for (var b = 0; b < particles.length; b++) {
        var p = particles[b];
        p.x += p.xs;
        p.y += p.ys;
        if (p.x > w || p.y > h) {
            p.x = Math.random() * w;
            p.y = -20;
        }
    }
}

setInterval(draw, 30);
