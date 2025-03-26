export const  rotateLeft = (player, rot = 0) => {
	let p = player.current;

	const oldDirX = p.dirX;
	p.dirX = p.dirX * Math.cos(rot) - p.dirY * Math.sin(rot);
	p.dirY = oldDirX * Math.sin(rot) + p.dirY * Math.cos(rot);

	const oldPlaneX = p.planeX;
	p.planeX = p.planeX * Math.cos(rot) - p.planeY * Math.sin(rot);
	p.planeY = oldPlaneX * Math.sin(rot) + p.planeY * Math.cos(rot);
}

export const rotateRight = (player, rot = 0) => {
	let p = player.current;
	// Both camera direction and camera plane must be rotated
	const oldDirX = p.dirX;
	p.dirX = p.dirX * Math.cos(-rot) - p.dirY * Math.sin(-rot);
	p.dirY = oldDirX * Math.sin(-rot) + p.dirY * Math.cos(-rot);

	const oldPlaneX = p.planeX;
	p.planeX = p.planeX * Math.cos(-rot) - p.planeY * Math.sin(-rot);
	p.planeY = oldPlaneX * Math.sin(-rot) + p.planeY * Math.cos(-rot);
}

export const moveForward = (player, map, speed) => {
	let p = player.current;

	// Move forward if no wall in front of you
	if (map[Math.floor((p.posX) + p.dirX * speed)][Math.floor(p.posY)] == 0)
		p.posX += p.dirX * speed;
	if (map[Math.floor(p.posX)][Math.floor(p.posY + p.dirY * speed)] == 0)
		p.posY += p.dirY * speed;
}

export const moveBackward = (player, map, speed) => {
	let p = player.current;
	// Move forward if no wall in front of you
	if(map[Math.floor(p.posX - p.dirX * speed)][Math.floor(p.posY)] == 0)
		p.posX -= p.dirX * speed;
	if(map[Math.floor(p.posX)][Math.floor(p.posY - p.dirY * speed)] == 0)
		p.posY -= p.dirY * speed;
}

export const moveLeft = (player, map, speed) => {
	rotateLeft(player, Math.PI / 2);
	moveForward(player, map, speed);
	rotateRight(player, Math.PI / 2);
}

export const moveRight = (player, map, speed) => {
	rotateRight(player, Math.PI / 2);
	moveForward(player, map, speed);
	rotateLeft(player, Math.PI / 2);
}