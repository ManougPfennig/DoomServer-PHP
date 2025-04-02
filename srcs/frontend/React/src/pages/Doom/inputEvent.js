export const handleKeyDown = (event, keys) => {
	
	// Listens for KeyDown event
	switch (event.key)
	{
		case 'z':
			keys.current.forward = true;
			break;
		case 's':
			keys.current.backward = true;
			break;
		case 'q':
			keys.current.left = true;
			break;
		case 'd':
			keys.current.right = true;
			break;
		case 'ArrowLeft':
			keys.current.turnL = true;
			break;
		case 'ArrowRight':
			keys.current.turnR = true;
			break;
	}
};

export const handleKeyUp = (event, keys) => {
	
	// Listens for KeyUp event
	switch (event.key)
	{
		case 'z':
			keys.current.forward = false;
			break;
		case 's':
			keys.current.backward = false;
			break;
		case 'q':
			keys.current.left = false;
			break;
		case 'd':
			keys.current.right = false;
			break;
		case 'ArrowLeft':
			keys.current.turnL = false;
			break;
		case 'ArrowRight':
			keys.current.turnR = false;
			break;
	}
};
