import React, { useRef, useState, useEffect } from 'react'
import FrameRenderer from './frameRenderer.js'
import raycaster from './raycaster.js'
import styles from './Doom.module.css'
import { moveLeft, moveRight, moveForward, moveBackward, rotateLeft, rotateRight } from './playerMovement.js'
import { handleKeyDown, handleKeyUp } from './inputEvent.js'

function Doom() {

	// Display
	const	[displayHeight, setDisplayHeight] = useState(500);
	const	[displayWidth, setDisplayWidth] = useState(800);
	const	[displayFPS, setDisplayFPS] = useState(0);
	const	height = useRef(500);
	const	width = useRef(800);
	const	canvasRef = useRef(null);
	const	keys = useRef({
		forward: false,
		left: false,
		right: false,
		backward: false,
		turnL: false,
		turnR: false,
	});
	
	// Raycaster
	const	player = useRef({
		// Player POV
		posX: 3, posY: 6,
		dirX: -1, dirY: 0,
		planeX: 0, planeY: 0.66,
		mouseY: 0,
	});

	// Speed modifiers
	const moveSpeed = (61 / 1000) * 2.0; // The constant value is in squares/second
	const rotSpeed = (61 / 1000) * 0.1; // The constant value is in radians/second
	
	// Game elements
	const	joined = useRef(false);
	const	map = [	"111111111111111111",
					"100000001000000001",
					"100000000000000001",
					"110000000000000011",
					"100000000000000001",
					"100000001100000001",
					"111111111111111111",
				]; // Game map

	useEffect(() => {

		// Key down event handler
		const keyDownEvent = (event) => {handleKeyDown(event, keys)}
		// Key up event handler
		const keyUpEvent = (event) => {handleKeyUp(event, keys)}
		// Mouse event handler
		const handleMouse = (event) => {

			if (joined.current == false) return;

			// Listens for MouseMove event
			let rot = Math.abs(event.movementX) * rotSpeed;
			player.current.mouseY -= event.movementY * 2;
		
			if (event.movementX > 0) rotateRight(player, rot);
			else if (event.movementX < 0) rotateLeft(player, rot);
		};

		// Adding event listeners on mount
		window.addEventListener('keydown', keyDownEvent);
		window.addEventListener('keyup', keyUpEvent);
		window.addEventListener('mousemove', handleMouse);
		return () => {
			// Removing event listeners on dismount
			window.removeEventListener('keydown', keyDownEvent);
			window.removeEventListener('keyup', keyUpEvent);
			window.removeEventListener('mousemove', handleMouse);
		};
	}, []);

	const handleMovement = () => {

		if (keys.current.forward) moveForward(player, map, moveSpeed);
		if (keys.current.backward) moveBackward(player, map, moveSpeed);
		if (keys.current.left) moveLeft(player, map, moveSpeed);
		if (keys.current.right) moveRight(player, map, moveSpeed);
		if (keys.current.turnL) rotateLeft(player);
		if (keys.current.turnR) rotateRight(player);
	}

	const runGameLoop = () => {
		const	renderer = new FrameRenderer(canvasRef.current, width.current, height.current);
		let		lastUpdate = Date.now();
		let		counterFPS = Date.now()
		let		frames = 0;

		const gameLoop = () => {
			const time = Date.now();
			const h = height.current;
			const w = width.current;

			if (time - counterFPS > 1000) {
				counterFPS = time;
				setDisplayFPS(frames);
				frames = 0;
			}

			// Max update per seconds
			if (time - lastUpdate > 1000 / 60) {
				// Update timestamp
				handleMovement();
				lastUpdate = time;
			}
			// Clear frame with a background color
			const offset = player.current.mouseY;
			renderer.resize(w, h) // Size update
			renderer.fillRect(0, 0, w, (h / 2) + offset, 64, 4, 0, 255); // Draw sky
			renderer.fillRect(0, (h / 2) + offset, w, h, 46, 34, 34, 255); // Draw floor

			// Process raycaster logic
			raycaster(renderer, player.current, map);
			
			// Display the rendered frame
			renderer.render();
			
			// Update FPS
			frames++;
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
			<p>{displayFPS} fps</p>

		</div>
	);
}

export default Doom