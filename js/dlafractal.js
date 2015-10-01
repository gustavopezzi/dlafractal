$(document).ready(function() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // build a matrix that corresponds to all pixels on the canvas
    var matrix = [];
    for (var x = 0; x < canvas.width; x++) {
        matrix[x] = [];
        
        for (var y = 0; y < canvas.height; y++)
            matrix[x][y] = 0;
    }

    // place the start point
    var midX = Math.round(canvas.width/2);
    var midY = Math.round(canvas.height/2);
    
    matrix[midX][midY] = 1;

    ctx.fillRect(midX, midY, 1, 1);

    var counter = 0;
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function Particle() {
        // picks a random point on the border of the canvas
        var random = Math.random();
        
        if (random > 0.5) {
            this.x = Math.random() * canvas.width;
            this.y = 0;
        }
        else {
            this.y = Math.random() * canvas.height;
            this.x = 0;
        }

        this.speed = 1;
        this.angle = Math.random() * 2 * Math.PI;

        this.move = function() {
            this.angle += Math.random() - 0.5;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            
            // wraps around the screen
            if (this.x >= canvas.width) {
                this.x = 0;
            }
            else if (this.x < 0) {
                this.x = canvas.width - 1;
            }
            
            if (this.y >= canvas.height) {
                this.y = 0;
            }
            else if (this.y < 0) {
                this.y = canvas.height - 1;
            }
        }
    }

    function isCollition(x, y) {
        if (x >= matrix.length || x < 0 || y >= matrix[x].length || y < 0)
            return false;
        return matrix[x][y] === 1;
    }

    var p = new Particle();

    var x, y;
    
    // brownian walk
    function walk() {
        for (var i = 0; i < 50; i++) {
            // walk around till we hit something
            do {
                p.move();
                x = Math.round(p.x);
                y = Math.round(p.y);
            }
            while (!(isCollition(x - 1, y - 1) ||
                isCollition(x, y - 1)          ||
                isCollition(x + 1, y - 1)      ||
                isCollition(x - 1, y)          ||
                isCollition(x, y)              ||
                isCollition(x + 1, y)          ||
                isCollition(x - 1, y + 1)      ||
                isCollition(x, y + 1)          ||
                isCollition(x + 1, y + 1)
            ));

            // we have a collition put a mark in the matrix and on the canvas
            matrix[x][y] = 1;
            ctx.fillStyle = "hsl(" + counter/100 + ", 100%, 50%)";
            ctx.fillRect(p.x, p.y, 1, 1);

            p = new Particle();
            x = Math.round(p.x);
            y = Math.round(p.y);

            counter++;
        }
        requestAnimationFrame(walk);
    }

    walk();
});