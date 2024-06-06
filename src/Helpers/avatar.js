// import Canvas from "canvas";
const Canvas = require("canvas");


function generateAvatar()
{
    const pixels = [10,10];
    const pixelSize = 10;
    const canvasSize = [pixels[0]*pixelSize,pixels[1]*pixelSize];
	const canvas = new Canvas.createCanvas(...canvasSize);
	const ctx  = canvas.getContext('2d');

    const color = `rgb(${50+parseInt(Math.random()*150)},${50+parseInt(Math.random()*150)},${50+parseInt(Math.random()*150)})`;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ...canvasSize);

    ctx.fillStyle = color;

    for (let y = 0; y < pixels[1]; y++)
    {
        for (let x = 0; x < pixels[0]/2; x++)
        {
            if(Math.random() <= 0.65)
            {
                ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize,pixelSize);
                ctx.fillRect((pixels[0]-x-1)*pixelSize,y*pixelSize,pixelSize,pixelSize);
            }
        }        
    }

	const imageData = canvas.toDataURL();
    return imageData;
}

module.exports = {generateAvatar};