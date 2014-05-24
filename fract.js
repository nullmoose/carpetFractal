var canvas,
    ctx,
    iterSlider,
    redSlider,
    greenSlider,
    blueSlider,
    red,
    green,
    blue,
    depth;

function init(){
    canvas = document.getElementById("canvasFract");
    ctx = canvas.getContext("2d");
    iterSlider = document.getElementById("iterationSlider");
    redSlider = document.getElementById("redSlider");
    greenSlider = document.getElementById("greenSlider");
    blueSlider = document.getElementById("blueSlider");
    
    canvas.width  = Math.min(window.innerWidth, window.innerHeight);
    canvas.height = Math.min(window.innerWidth, window.innerHeight);
    
    iterSlider.min = 0; iterSlider.max = 5; iterSlider.value = 5;
    redSlider.min = 0; redSlider.max = 255; redSlider.value = 200;
    greenSlider.min = 0; greenSlider.max = 255; greenSlider.value = 0;
    blueSlider.min = 0; blueSlider.max = 255; blueSlider.value = 0;
    
    clearCanvas();
    setColor(200,0,0);
    draw(Math.round(canvas.width/3),0,0,0,6);
}

function draw(l, x, y, de, dl){
    ctx.fillRect(x+l,y+l,l,l);
    
    var nl = Math.round(l/3);
    
    if (de<dl) {
        draw(nl,x       ,y         ,de+1,dl);
        draw(nl,x+l     ,y         ,de+1,dl);
        draw(nl,x+(l*2) ,y         ,de+1,dl);
        draw(nl,x       ,y+l       ,de+1,dl);
        draw(nl,x+(l*2) ,y+l       ,de+1,dl);
        draw(nl,x       ,y+(l*2)   ,de+1,dl);
        draw(nl,x+l     ,y+(l*2)   ,de+1,dl);
        draw(nl,x+(l*2) ,y+(l*2)   ,de+1,dl);
    }
}

function setColor(r,g,b) {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
}

function clearCanvas() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function renderButtonPressed() {
    red = redSlider.value;
    green = greenSlider.value;
    blue = blueSlider.value;
    depth = iterSlider.value;
    
    clearCanvas();
    
    setColor(red,green,blue);
    draw(Math.round(canvas.width/3),0,0,0,depth);
}
