// import Canvas from "canvas";
const Canvas = require("canvas");


export function generateAvatarString(color="")
{ 
    let avatarString = color || rgbToHex(50+parseInt(Math.random()*150),50+parseInt(Math.random()*150),50+parseInt(Math.random()*150));
    
    for(let i = 0; i < 32; i++)
    {
        if(Math.random() <= 0.65)
        {
            avatarString += "."+i;
        }
    }

    return avatarString;
}

export function generateAvatar(avatarString)
{
    const avatarStringArray = avatarString.split(".");
    const pixelSize = 10;
    const canvasSize = [8*pixelSize,8*pixelSize];
	const canvas = new Canvas.createCanvas(...canvasSize);
	const ctx  = canvas.getContext('2d');

    const color = "#"+avatarStringArray[0];

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ...canvasSize);

    ctx.fillStyle = color;

    for(let i = 1; i < avatarStringArray.length; i++)
    {
        const n = avatarStringArray[i];
        const x = n%4; const y = parseInt(n/4);
        ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize,pixelSize);
        ctx.fillRect((8-x-1)*pixelSize,y*pixelSize,pixelSize,pixelSize);

    }

    // for (let y = 0; y < pixels[1]; y++)
    // {
    //     for (let x = 0; x < pixels[0]/2; x++)
    //     {
    //         if(Math.random() <= 0.65)
    //         {
    //             ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize,pixelSize);
    //             ctx.fillRect((pixels[0]-x-1)*pixelSize,y*pixelSize,pixelSize,pixelSize);
    //         }
    //     }        
    // }

	const imageData = canvas.toDataURL();
    return imageData;
}

const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
  
export const rgbToHex = (r, g, b) => {
    return "" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
// module.exports = {generateAvatar};