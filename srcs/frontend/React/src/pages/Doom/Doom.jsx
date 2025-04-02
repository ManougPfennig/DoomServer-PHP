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
	const	textures = useRef(null);
	const	height = useRef(500);
	const	width = useRef(800);
	const	canvasRef = useRef(null);

	// Raycaster
	const	player = useRef({
		// Player POV
		posX: 2, posY: 2,
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
		"1111111111111111111111111111111",
		"1000000000000000100000100000001",
		"1011101010111110111010111011101",
		"1010101010100010100010100010001",
		"1010111010101111111010101110111",
		"1010100010001010100010000010001",
		"1110101111101010111111101110111",
		"1000101000000010101010101010001",
		"1011101111100000000000101010111",
		"1000000000100000000000001000001",
		"1011111010110000000000111110101",
		"1000100010000000000000000000101",
		"1010101110110000000000101110111",
		"1010100010000000000000000010001",
		"1011111111110000000000111111101",
		"1000001000000000000000100000101",
		"1010111011100000000000111110101",
		"1010001010000000000000000000101",
		"1011111011101111111011101111111",
		"1010101000101000000010000010101",
		"1010101010101010101110111010101",
		"1010000010101010101000101010101",
		"1010111111111111111110101010101",
		"1010001000101000000010001010001",
		"1110111011101110111111101010101",
		"1000100000000000001000001000101",
		"1011111011111110101010111110111",
		"1000000010001000100010000010101",
		"1010111110111111101110101111101",
		"1010000000000000100010100000001",
		"1111111111111111111111111111111"
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

			// Max 61 physics updates per seconds
			if (time - lastUpdate > 1000 / 61) {
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
			raycaster(renderer, player.current, map, textures.current);

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
			
			// Initialize textures then run game loop
			initializeTextures()
				.then(loadedTextures => {
					textures.current = loadedTextures;
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