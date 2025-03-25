
function raycaster(r, p, map)
{
	let w = r.width;
	let h = r.height;

	let posX = p.posX, posY = p.posY;
	let dirX = p.dirX, dirY = p.dirY;
	let planeX = p.planeX, planeY = p.planeY;

	for (let x = 0; x < w; x++)
	{
		//Calculate ray position and direction
		let cameraX = 2 * x / w - 1; //x-coordinate in camera space
		let rayDirX = dirX + planeX * cameraX;
		let rayDirY = dirY + planeY * cameraX;

		// Which box of the map we're in
		let mapX = Math.floor(posX);
		let mapY = Math.floor(posY);

		// Length of ray from current position to next x or y-side
		let sideDistX;
		let sideDistY;

		// Length of ray from one x or y-side to next x or y-side
		let deltaDistX = (rayDirX == 0) ? 1e30 : Math.abs(1 / rayDirX);
		let deltaDistY = (rayDirY == 0) ? 1e30 : Math.abs(1 / rayDirY);
		let perpWallDist;

		// What direction to step in x or y-direction (either +1 or -1)
		let stepX;
		let stepY;

		let hit = 0; // Was there a wall hit?
		let side; // Was a NS or a EW wall hit?

		// Calculate step and initial sideDist
		if (rayDirX < 0) {
			stepX = -1;
			sideDistX = (posX - mapX) * deltaDistX;
		}
		else {
			stepX = 1;
			sideDistX = (mapX + 1.0 - posX) * deltaDistX;
		}
		if (rayDirY < 0) {
			stepY = -1;
			sideDistY = (posY - mapY) * deltaDistY;
		}
		else {
			stepY = 1;
			sideDistY = (mapY + 1.0 - posY) * deltaDistY;
		}

		// Perform DDA 'Digital Differential Analysis'
		while (hit == 0)
		{
			// Jump to next map square, either in x-direction, or in y-direction
			if (sideDistX < sideDistY) {
				sideDistX += deltaDistX;
				mapX += stepX;
				side = 0;
			}
			else {
				sideDistY += deltaDistY;
				mapY += stepY;
				side = 1;
			}
			// Check if ray has hit a wall
			if (map[mapX][mapY] > 0) hit = 1;
		}

		// Calculate distance projected on camera direction (Euclidean distance would give fisheye effect!)
		if (side == 0)
			perpWallDist = (sideDistX - deltaDistX);
		else
			perpWallDist = (sideDistY - deltaDistY);

		// Calculate height of line to draw on screen
		let lineHeight = Math.floor(h / perpWallDist);

		// Calculate lowest and highest pixel to fill in current stripe
		let drawStart = -lineHeight / 2 + h / 2;
		if (drawStart < 0)
			drawStart = 0;
		let drawEnd = lineHeight / 2 + h / 2;
		if (drawEnd >= h)
			drawEnd = h - 1;

		// Choose wall color

		// Give depth with different brightness
		let shade = Math.abs(((perpWallDist / 20) * 255) - 255);

		//draw the pixels of the stripe as a vertical line
		r.verticalLine(x, drawStart, drawEnd, shade, shade, shade, 255);
	}
}

export default raycaster