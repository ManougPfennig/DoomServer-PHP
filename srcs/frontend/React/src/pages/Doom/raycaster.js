
function raycaster(r, p, map, textures)
{
	let w = r.width;
	let h = r.height;

	const posX = p.posX, posY = p.posY;
	const dirX = p.dirX, dirY = p.dirY;
	const planeX = p.planeX, planeY = p.planeY;

	for (let x = 0; x < w; x++)
	{
		//Calculate ray position and direction
		const cameraX = 2 * x / w - 1; //x-coordinate in camera space
		const rayDirX = dirX + planeX * cameraX;
		const rayDirY = dirY + planeY * cameraX;

		// Which box of the map we're in
		let mapX = Math.floor(posX);
		let mapY = Math.floor(posY);

		// Length of ray from current position to next x or y-side
		let sideDistX = 0;
		let sideDistY = 0;

		// Length of ray from one x or y-side to next x or y-side
		const deltaDistX = (rayDirX == 0) ? Infinity : Math.abs(1 / rayDirX);
		const deltaDistY = (rayDirY == 0) ? Infinity : Math.abs(1 / rayDirY);
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
		const lineHeight = Math.floor(h / perpWallDist);
		const offset = p.mouseY;

		// Calculate lowest and highest pixel to fill in current stripe
		let drawStart = (-lineHeight / 2 + h / 2) + offset;
		if (drawStart < 0)
			drawStart = 0;
		let drawEnd = (lineHeight / 2 + h / 2) + offset;
		if (drawEnd >= h)
			drawEnd = h - 1;



		// Texturing calculations
		// const texNum = worldMap[mapX][mapY] - 1; // 1 subtracted from it so that texture 0 can be used
		const texNum = 0;
		const texWidth = textures[texNum].size.width;

		// Calculate value of wallX
		let wallX; //where exactly the wall was hit
		if (side == 0)
			wallX = posY + perpWallDist * rayDirY;
		else
			wallX = posX + perpWallDist * rayDirX;
		wallX -= Math.floor(wallX);

		// X coordinate on the texture
		let texX = Math.floor(wallX * texWidth);
		if (side == 0 && rayDirX > 0)
			texX = texWidth - texX - 1;
		if (side == 1 && rayDirY < 0)
			texX = texWidth - texX - 1;

		r.drawTexturedline(textures[texNum], texX, x, drawStart, drawEnd, lineHeight)
	}
	return ;
}

export default raycaster