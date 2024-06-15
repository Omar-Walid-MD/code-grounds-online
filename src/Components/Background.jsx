import React, { useEffect, useRef } from 'react';

function Background({}) {

    const height = 720;
    const width = 1280;
    const canvasRef = useRef();

    let particles = [];



    function draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.globalAlpha = 1
        ctx.fillStyle = '#2f5035'
        ctx.fillRect(0, 0, width, height);

        particles.forEach((particle)=>{
            ctx.fillStyle = "#4d915a";
            ctx.globalAlpha = particle.opacity
            ctx.fillRect(particle.position.x-particle.size/2,particle.position.y-particle.size/2,particle.size,particle.size);

            particle.position.x += Math.cos(particle.angle) * particle.speed;
            particle.position.y += Math.sin(particle.angle) * particle.speed;

            let acceleration = 0.1;
            particle.speed += acceleration;
            particle.size += particle.sizeGrowth;
            particle.opacity += 0.01

            if(Math.abs(particle.position.x - width/2)-particle.size/2 > width/2 || Math.abs(particle.position.y - height/2)-particle.size/2 > height/2)
            {
                particle.alive = false
                console.log("unalived");
            }
        });

        particles = particles.filter((p)=>p.alive);

    }

    useEffect(()=>{

        const context = canvasRef.current.getContext("2d");

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
        const timer = setInterval(() => {

            for(let i = 0; i < Math.floor(Math.random()*5); i++)
            {
                particles.push({
                    position: {x:width/2,y:height/2},
                    size: 0,
                    alive: true,
                    speed: 1,
                    angle: Math.random()*Math.PI*2-Math.PI,
                    opacity:0,
                    sizeGrowth: Math.random()*1
                });
            }
        }, 100);

        return ()=>clearInterval(timer);
    },[])

    return (
        <div className='page-container d-flex align-items-center justify-content-center'>
            <canvas
            height={height}
            width={width}
            ref={canvasRef}
            tabIndex="0"
            className='border border-black'
            >
                
            </canvas>
        </div>
    );
}

export default Background;