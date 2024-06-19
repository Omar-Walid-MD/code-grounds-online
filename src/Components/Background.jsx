import React, { useEffect, useRef, useState } from 'react';

function Background({}) {

    const canvasRef = useRef();

    let particles = [];



    function draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.globalAlpha = 1
        ctx.fillStyle = '#2f5035'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        particles.forEach((particle)=>{
            ctx.fillStyle = "#4d915a";
            ctx.globalAlpha = particle.opacity
            ctx.fillRect(particle.position.x-particle.size/2,particle.position.y-particle.size/2,particle.size,particle.size);

            particle.position.x += Math.cos(particle.angle) * particle.speed;
            particle.position.y += Math.sin(particle.angle) * particle.speed;

            let acceleration = 0.075;
            particle.speed += acceleration;
            particle.size += particle.sizeGrowth;
            particle.opacity += 0.0075

            if(Math.abs(particle.position.x - ctx.canvas.width/2)-particle.size/2 > ctx.canvas.width/2 || Math.abs(particle.position.y - ctx.canvas.height/2)-particle.size/2 > ctx.canvas.height/2)
            {
                particle.alive = false
            }
        });

        particles = particles.filter((p)=>p.alive);

    }

    useEffect(()=>{

        window.addEventListener("resize",(e)=>{
            console.log(window.innerWidth, window.innerHeight);
            const context = canvasRef.current.getContext("2d");
            context.canvas.width  = window.innerWidth;
            context.canvas.height = window.innerHeight;
    
        })

    },[]);
   

    useEffect(()=>{

        const context = canvasRef.current.getContext("2d");
        context.canvas.width  = window.innerWidth;
        context.canvas.height = window.innerHeight;


        let frameId;

        function render()
        {
            draw(context);
            // update();
            frameId = window.requestAnimationFrame(render);
        }
        render()

        return ()=>{
            window.cancelAnimationFrame(frameId);
        }
    },[]);

    useEffect(()=>{

        const context = canvasRef.current.getContext("2d");

        const timer = setInterval(() => {

            for(let i = 0; i < Math.floor(Math.random()*5); i++)
            {
                particles.push({
                    position: {x:context.canvas.width/2,y:context.canvas.height/2},
                    size: 0,
                    alive: true,
                    speed: 1,
                    angle: Math.random()*Math.PI*2-Math.PI,
                    opacity:0,
                    sizeGrowth: Math.random()*0.75
                });
            }
        }, 100);

        return ()=>clearInterval(timer);
    },[])

    return (
        <canvas
        className='position-absolute overflow-hidden'
        ref={canvasRef}
        tabIndex="0"
        style={{inset:"0",zIndex:"-1"}}
        >
            
        </canvas>
    );
}

export default Background;