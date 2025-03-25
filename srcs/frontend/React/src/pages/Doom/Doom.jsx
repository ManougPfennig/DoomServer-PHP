import React, { useRef, useState, useEffect } from 'react'
import FrameRenderer from './frameRenderer.js'
import raycaster from './raycaster.js'
import styles from './Doom.module.css'

function Doom() {

	// Display
	const	[displayHeight, setDisplayHeight] = useState(500);
	const	[displayWidth, setDisplayWidth] = useState(800);
	const	height = useRef(500);
	const	width = useRef(800);
	const	canvasRef = useRef(null);
	
	// Raycaster
	const	player = useRef({
		// Player POV
		posX: 3, posY: 3,
		dirX: -1, dirY: -1,
		planeX: 0, planeY: 0.66,
		// Speed modifiers
		moveSpeed: (25 / 1000) * 5.0, // The constant value is in squares/second
		rotSpeed: (25 / 1000) * 3.0, // The constant value is in radians/second
	});
	
	// Game elements
	const	joined = useRef(false);
	const	map = useRef([	"111111111111111111",
							"100000000000000001",
							"100000000000000001",
							"110100000000000001",
							"100000000000000001",
							"100000000000000001",
							"111111111111111111",
						]); // Game map

	const runGameLoop = () => {
		const	renderer = new FrameRenderer(canvasRef.current, width.current, height.current);
		let		lastUpdate = Date.now();

		const gameLoop = () => {
			const time = Date.now();

			// Max update per seconds
			if (time - lastUpdate > 1000 / 61) {

				// Clear frame with a background color
				if (renderer.resize(width.current, height.current) == 0) // Size update
					renderer.clear(0, 0, 0, 255); // Black background

				// Process raycaster logic
				raycaster(renderer, player.current, map.current);
				
				// Display the rendered frame
				renderer.render();
				
				// Update timestamp
				lastUpdate = time;
			}
			// Schedule next frame
			requestAnimationFrame(gameLoop);
		}
		
		// Start the game loop
		requestAnimationFrame(gameLoop);
		return () => cancelAnimationFrame(gameLoop);
	}

	const joinGame = () => {
		if (joined.current == false) {
			runGameLoop();
			joined.current = true;
		}
	}

	// Update display width
	const updateWidth = (newWidth) => {
		setDisplayWidth(newWidth);
		width.current = newWidth;
	}

	// Update display heightworldMap
	const updateHeight = (newHeight) => {
		setDisplayHeight(newHeight);
		height.current = newHeight;
	}

	const rotateLeft = () => {
		let p = player.current;
		let oldDirX = p.dirX;

		p.dirX = p.dirX * Math.cos(p.rotSpeed) - p.dirY * Math.sin(p.rotSpeed);
		p.dirY = oldDirX * Math.sin(p.rotSpeed) + p.dirY * Math.cos(p.rotSpeed);
		let oldPlaneX = p.planeX;
		p.planeX = p.planeX * Math.cos(p.rotSpeed) - p.planeY * Math.sin(p.rotSpeed);
		p.planeY = oldPlaneX * Math.sin(p.rotSpeed) + p.planeY * Math.cos(p.rotSpeed);
	}

	const rotateRight = () => {
		let p = player.current;
		// Both camera direction and camera plane must be rotated
		let oldDirX = p.dirX;
		p.dirX = p.dirX * Math.cos(-p.rotSpeed) - p.dirY * Math.sin(-p.rotSpeed);
		p.dirY = oldDirX * Math.sin(-p.rotSpeed) + p.dirY * Math.cos(-p.rotSpeed);
		let oldPlaneX = p.planeX;
		p.planeX = p.planeX * Math.cos(-p.rotSpeed) - p.planeY * Math.sin(-p.rotSpeed);
		p.planeY = oldPlaneX * Math.sin(-p.rotSpeed) + p.planeY * Math.cos(-p.rotSpeed);
	}

	return (
		<div className={styles.centered_container}>

			{/* Change display size */}
			<div className={styles.rows}>
				<div className={styles.button_rows}>
					<button onClick={() => updateHeight(displayHeight + (displayHeight >= 750 ? 0 : 25))}>+</button>
					<p>HEIGHT</p>
					<button onClick={() => updateHeight(displayHeight + (displayHeight <= 125 ? 0 : -25))}>-</button>
				</div>

				<div className={styles.button_rows}>
					<button onClick={() => updateWidth(displayWidth + (displayWidth >= 1200 ? 0 : 25))}>+</button>
					<p>WIDTH</p>
					<button onClick={() => updateWidth(displayWidth + (displayWidth <= 200 ? 0 : -25))}>-</button>
				</div>
			</div>

			{/* Display height and width */}
			<p style={{margin: '0vh', fontSize: '1.5vh'}}>{displayHeight} * {displayWidth}</p>

			<div	style={{ width: `${displayWidth}px`, height: `${displayHeight}px`}}
					className={styles.canvas_container}>
				<canvas style={{ width: `${displayWidth}px`, height: `${displayHeight}px`}}
						ref={canvasRef}
						width={displayWidth}
						height={displayHeight}
						onClick={() => joinGame()}/>
			</div>

			<div className={styles.button_rows}>
				<button onClick={() => rotateLeft()}>LEFT</button>
				<button onClick={() => rotateLeft()}>LEFT</button>
				<button onClick={() => rotateRight()}>RIGHT</button>
			</div>
		</div>
	);
}

export default Doom