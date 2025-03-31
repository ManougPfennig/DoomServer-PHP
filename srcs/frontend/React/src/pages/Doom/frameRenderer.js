class FrameRenderer {
	
	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		// Set canvas dimensions
		this.canvas.width = width;
		this.canvas.height = height;
		
		// Create frame buffer as ImageData
		this.frameBuffer = this.ctx.createImageData(width, height);
		this.frameData = this.frameBuffer.data;
		
		// For convenience
		this.width = width;
		this.height = height;
		
		// Pre-calculate buffer size
		this.bufferSize = width * height * 4;
		
		// Clear buffer with transparent black
		this.clear();
	}
	
	// Set a single pixel in the buffer
	setPixel(x, y, r, g, b, a = 255) {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;

		const index = (y * this.width + x) * 4;
		this.frameData[index] = r;
		this.frameData[index + 1] = g;
		this.frameData[index + 2] = b;
		this.frameData[index + 3] = a;
	}
	
	// Clear the buffer with a color
	clear(r = 0, g = 0, b = 0, a = 255) {
		for (let i = 0; i < this.bufferSize; i += 4) {
			this.frameData[i] = r;
			this.frameData[i + 1] = g;
			this.frameData[i + 2] = b;
			this.frameData[i + 3] = a;
		}
	}
	
	// Render the buffer to the canvas
	render() {
		this.ctx.putImageData(this.frameBuffer, 0, 0);
	}
	
	// Resize the renderer
	resize(width, height) {
		if (this.width == width && this.height == height)
			return ; // No need to resize

		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.frameBuffer = this.ctx.createImageData(width, height);
		this.frameData = this.frameBuffer.data;
		this.bufferSize = width * height * 4;
	}
	
	// Draw a filled rectangle
	fillRect(x, y, width, height, r, g, b, a = 255) { 
		const x1 = Math.max(0, Math.floor(x));
		const y1 = Math.max(0, Math.floor(y));
		const x2 = Math.min(this.width - 1, Math.floor(x + width));
		const y2 = Math.min(this.height - 1, Math.floor(y + height));
		
		for (let cy = y1; cy <= y2; cy++) {
			for (let cx = x1; cx <= x2; cx++) {
				this.setPixel(cx, cy, r, g, b, a);
			}
		}
	}

	// Fill a zone of the image
	fillZone(x1, y1, x2, y2, r, g, b, a = 255) { 
		x1 = Math.max(0, Math.floor(x1));
		y1 = Math.max(0, Math.floor(y1));
		x2 = Math.max(this.width - 1, Math.floor(x2));
		y2 = Math.max(this.height - 1, Math.floor(y2));
		
		for (let cy = y1; cy <= y2; cy++) {
			for (let cx = x1; cx <= x2; cx++) {
				this.setPixel(cx, cy, r, g, b, a);
			}
		}
	}
	
	// Draw a vertical line
	verticalLine(x, y1, y2, r, g, b, a = 255) {
		x = Math.floor(x);
		y1 = Math.floor(y1);
		y2 = Math.floor(y2);
		const dir = (y1 >= y2 ? -1 : 1);
		
		this.setPixel(x, y1, r, g, b, a);
		while (y1 != y2) {
			this.setPixel(x, y1, r, g, b, a);
			y1 += dir;
		}
	}

	// Draw a line using Bresenham's algorithm
	skewedLine(x1, y1, x2, y2, r, g, b, a = 255) {
		x1 = Math.floor(x1);
		y1 = Math.floor(y1);
		x2 = Math.floor(x2);
		y2 = Math.floor(y2);
		
		const dx = Math.abs(x2 - x1);
		const dy = Math.abs(y2 - y1);
		const sx = x1 < x2 ? 1 : -1;
		const sy = y1 < y2 ? 1 : -1;
		let err = dx - dy;
		
		while (true) {
			this.setPixel(x1, y1, r, g, b, a);
			
			if (x1 === x2 && y1 === y2) break;
			
			const e2 = 2 * err;
			if (e2 > -dy) {
				if (x1 === x2) break;
				err -= dy;
				x1 += sx;
			}
			if (e2 < dx) {
				if (y1 === y2) break;
				err += dx;
				y1 += sy;
			}
		}
	}

	drawTexturedline(texture, texX, x, drawStart, drawEnd, lineHeight) {
		// For readability
		const texHeight = texture.size.height;
		const texWidth = texture.size.width;
		const a = texture.rgbaArray;
	
		// Ensure texX is within bounds
		texX = Math.max(0, Math.min(texX, texWidth - 1));
	
		// How much to increase the texture coordinate per screen pixel
		const step = texHeight / lineHeight;
	
		// Starting texture coordinate - adjusted for precise mapping
		let texPos = (drawStart - this.height / 2 + lineHeight / 2) * step;
		
		// Add a very small offset to avoid floating point precision issues
		texPos = Math.max(0, texPos + 0.0001);
	
		for (let y = Math.floor(drawStart); y < Math.ceil(drawEnd); y++) {
			// Ensure y is within screen bounds
			// if (y < 0 || y >= this.height) continue;
			
			// Calculate texY ensuring it's within bounds
			const texY = Math.floor(texPos) % texHeight;
			texPos += step;
			
			// Calculate the pixel position in the rgba array (4 bytes per pixel)
			const p = 4 * (texY * texWidth + texX);
			
			// Ensure we're not accessing outside the array
			if (p >= 0 && p + 3 < a.length) {
				this.setPixel(x, y, a[p], a[p + 1], a[p + 2], a[p + 3]);
			}
		}
	}
}
	

export default FrameRenderer;