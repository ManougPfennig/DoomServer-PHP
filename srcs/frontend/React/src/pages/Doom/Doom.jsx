import React, { useRef, useState, useEffect } from 'react'
import FrameRenderer from './frameRenderer.js'
import raycaster from './raycaster.js'
import styles from './Doom.module.css'
import { moveLeft, moveRight, moveForward, moveBackward, rotateLeft, rotateRight } from './playerMovement.js'
import { handleKeyDown, handleKeyUp } from './inputEvent.js'
import initializeTextures from './initializeTextures.js'

function Doom() {

	// Display
	const	[displayHeight, setDisplayHeight] = useState(500);
	const	[displayWidth, setDisplayWidth] = useState(800);
	const	[resolution, setResolution] = useState(1);
	const	[displayFPS, setDisplayFPS] = useState(0);
	const	[isLoading, setIsLoading] = useState(false);
	const	[textures, setTextures] = useState(null);
	const	height = useRef(500);
	const	width = useRef(800);
	const	canvasRef = useRef(null);

	// Raycaster
	const	player = useRef({
		// Player POV
		posX: 3, posY: 6,
		dirX: -1, dirY: 0,
		planeX: 0, planeY: 0.66,
		mouseY: 0,
	});
	const	keys = useRef({
		// Player movement
		forward: false,
		left: false,
		right: false,
		backward: false,
		turnL: false,
		turnR: false,
	});
	
	// Game elements
	const	joined = useRef(false);
	const	moveSpeed = (60 / 1000) * 2.0; // The value is in squares/second
	const	rotSpeed = (60 / 1000) * 0.1; // The value is in radians/second
	const	map = [ // Game map
		"111111111111111111111111111111",
		"100000000000000000000000000001",
		"100000000000000000000000000001",
		"110000000000000000000000000011",
		"100000000000000000000000000001",
		"100000000110000000000000000001",
		"100000000000000000000000000001",
		"100000000000000000000000000001",
		"100000000000000000000000000001",
		"100000000000000000000000000001",
		"100000000000000000000000000001",
		"110000000000000000000000000011",
		"111000000000000000000000000111",
		"100000000000000000000000000001",
		"111111111111111111111111111111"
	];

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
			// Change direction
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

		// Update the player's position and direction
		if (keys.current.forward && !keys.current.backward) moveForward(player, map, moveSpeed);
		if (keys.current.backward && !keys.current.forward) moveBackward(player, map, moveSpeed);
		if (keys.current.left && !keys.current.right) moveLeft(player, map, moveSpeed);
		if (keys.current.right && !keys.current.left) moveRight(player, map, moveSpeed);
		if (keys.current.turnL) rotateLeft(player);
		if (keys.current.turnR) rotateRight(player);
	}

	const runGameLoop = () => {
		const	renderer = new FrameRenderer(canvasRef.current, width.current, height.current);
		let		lastUpdate = 0;
		let		counterFPS = 0;
		let		frames = 0;

		const gameLoop = (time) => {
			const h = height.current;
			const w = width.current;

			// Display the amount of frames rendered
			if (time - counterFPS > 1000) {
				counterFPS = time;
				setDisplayFPS(frames);
				frames = 0;
			}

			// Max 60 physics updates per seconds
			if (time - lastUpdate > 1000 / 60) {
				// Update timestamp
				handleMovement();
				lastUpdate = time;
			}

			// Clear frame with a background color
			const offset = player.current.mouseY;
			renderer.resize(w, h) // Size update
			renderer.fillZone(0, 0, w, (h / 2) + offset, 64, 4, 0, 255); // Draw sky
			renderer.fillZone(0, (h / 2) + offset, w, h, 92, 68, 68, 255); // Draw floor

			// Render frame with raycasting logic
			raycaster(renderer, player.current, map);

			// Set the rendered frame to the canvas for display
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
			setIsLoading(true);
			
			// Initialize textures and run game loop
			initializeTextures()
				.then(loadedTextures => {
					setTextures(loadedTextures);
					runGameLoop();
					joined.current = true;
					setIsLoading(false);
				})
				.catch(error => {
					console.error("Failed to initialize texture:", error);
					setIsLoading(false);
				});
		}
	}

	// Update display size
	const updateSize = (ratio) => {
		const h = Math.floor(500 * ratio);
		const w = Math.floor(800 * ratio);
		setDisplayHeight(h);
		setDisplayWidth(w);
		height.current = h;
		width.current = w;
		setResolution(ratio);
	}

	return (
		<div className={styles.centered_container}>

			{/* Change display size */}
			<div className={styles.rows}>
				<div className={styles.button_rows}>
					<button onClick={() => updateSize(resolution + (resolution >= 1.5 ? 0 : 0.1))}>+</button>
					<p>RESOLUTION</p>
					<button onClick={() =>	updateSize(resolution - (resolution <= 0.5 ? 0 : 0.1))}>-</button>
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
			<p>{isLoading ? "Loading..." : displayFPS + " fps"}</p>

		</div>
	);
}

export default Doom