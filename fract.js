var canvas,
    ctx,
    iterSlider,
    redSlider,
    greenSlider,
    blueSlider;

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
    setColor();
    draw(Math.round(canvas.width/3),0,0,0,iterSlider.value,false);
}

function draw(l, x, y, de, dl, rand){
    
    if (rand) {
        setrandomColor();
    }
    ctx.fillRect(x+l,y+l,l,l);
    
    var nl = Math.round(l/3);
    
    if (de<dl) {
        draw(nl,x       ,y         ,de+1,dl,rand);
        draw(nl,x+l     ,y         ,de+1,dl,rand);
        draw(nl,x+(l*2) ,y         ,de+1,dl,rand);
        draw(nl,x       ,y+l       ,de+1,dl,rand);
        draw(nl,x+(l*2) ,y+l       ,de+1,dl,rand);
        draw(nl,x       ,y+(l*2)   ,de+1,dl,rand);
        draw(nl,x+l     ,y+(l*2)   ,de+1,dl,rand);
        draw(nl,x+(l*2) ,y+(l*2)   ,de+1,dl,rand);
    }
}

function setColor() {
    ctx.fillStyle = "rgb(" + redSlider.value + "," + greenSlider.value + "," + blueSlider.value + ")";
}

function setrandomColor(){
    red = Math.floor(Math.random()*255);
    green = Math.floor(Math.random()*255);
    blue = Math.floor(Math.random()*255);
    
    ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";
}

function clearCanvas() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function renderButtonPressed() {
    clearCanvas();
    
    setColor();
    draw(Math.round(canvas.width/3),0,0,0,iterSlider.value,false);
}

function clicked(){
    clearCanvas();
    draw(Math.round(canvas.width/3),0,0,0,iterSlider.value,true);
}
