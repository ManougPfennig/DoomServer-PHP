import smile from "../../assets/smile.png"

function convertImageToRGBAArray(imageSrc) {

	// Return a Promise to handle the asynchronous image loading
	return new Promise((resolve, reject) => {
		const img = new Image();
		
		// Draw image to a canvas when fully loaded
		img.onload = () => {
			// Create a canvas and get its 2D context
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			
			// Set canvas dimensions to match the image
			canvas.width = img.width;
			canvas.height = img.height;
			
			// Draw the image onto the canvas
			ctx.drawImage(img, 0, 0);
			
			// Get the image data (RGBA values)
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;
			
			// Store dimensions for later use in raycaster
			const size = {
				width: img.width,
				height: img.height
			};
			
			// Storing image pixel information in Uint8Array
			const rgbaArray = new Uint8Array(data);
			
			// Resolve the promise with the data
			resolve({size, rgbaArray});
		};
		
		// Handle loading errors
		img.onerror = () => {
			reject(new Error('Failed to load image'));
		};
		
		// Start loading the image
		img.src = imageSrc;
	});
}

function loadTextures() {
	const texturePromises = [
		convertImageToRGBAArray(smile),
		convertImageToRGBAArray(smile),
		// Add more textures as needed
	];

	return Promise.all(texturePromises)
		.then(textures => {
			// Store textures in a convenient format for the raycaster
			const textureMap = {
				wall1: textures[0].rgbaArray,
				wall2: textures[1].rgbaArray,
				// Map more textures as needed
			};
			return textureMap;
		}
	);
}


async function initializeTextures() {
	try {
		// Load all textures at when game is joined
		const textures = await loadTextures();
		return textures;
	}
	catch (error) {
		console.error('Error loading textures:', error);
	}
}

export default initializeTextures