// Home.jsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';

function Home()
{
	const [visibleSections, setVisibleSections] = useState({
		section1: false,
		section2: false,
		section3: false,
	});
	
	const section1Ref = useRef(null);
	const section2Ref = useRef(null);
	const section3Ref = useRef(null);
	const defaultBgColor = "#242424";
	const hoverBgColor = "#361212";

	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + window.innerHeight;

			// Check each section and update its visibility based on scroll position
			if (section1Ref.current) {
				const section1Position = section1Ref.current.offsetTop;
				setVisibleSections(prev => ({
					...prev,
					section1: scrollPosition > section1Position + 100
				}));
			}

			if (section2Ref.current) {
				const section2Position = section2Ref.current.offsetTop;
				setVisibleSections(prev => ({
					...prev,
					section2: scrollPosition > section2Position + 100
				}));
			}

			if (section3Ref.current) {
				const section3Position = section3Ref.current.offsetTop;
				setVisibleSections(prev => ({
					...prev,
					section3: scrollPosition > section3Position + 100
				}));
			}
		};

		handleScroll();
  
		// Add scroll event listener
		window.addEventListener('scroll', handleScroll);
	
		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	
	useEffect(() => {
		// Change the background color when 'Join Game' is hovered
		document.body.style.backgroundColor = isHovered ? hoverBgColor : defaultBgColor;
		document.body.style.transition = "background-color 1.5s ease";
		
		return () => {
			document.body.style.backgroundColor = defaultBgColor;
			document.body.style.transition = "";
		};
	}, [isHovered]);

	const JoinGame = () => {
		console.log("CLikced");
	}

	return (
		<div className={styles.home_container}>

			<div className={styles.top_container}>
				<p>Hi, and welcome to</p>
				<h1>DOOM SERVER</h1>
				<h3>Very glad to have you here !</h3>
			</div>

			<div ref={section1Ref} className={visibleSections.section1 ? styles.visible : styles.hidden}>
				<p>This website was developped using <b>React</b> and <b>Symfony</b> frameworks.</p>
				<div className={styles.rows}>
					<a href="https://react.dev/" target="_blank">
					<img	src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png"
							alt="React logo"
					/></a>
					<a href="https://symfony.com/" target="_blank">
					<img	src="https://www.peanutsquare.com/wp-content/uploads/2024/04/Symfony-1-1.png"
							alt="Symfony logo"
					/></a>
				</div>
			</div>

			<div ref={section2Ref} className={visibleSections.section2 ? styles.visible : styles.hidden}>
				<p>The point of Doom Server was learning <b>how to use the Symfony framework as a student developer</b>.</p>
				<p>Also, <b>PHP is a language used by 75% of websites</b> on the internet, it's a good one to know.</p>
			</div>

			<div ref={section3Ref} className={visibleSections.section3 ? styles.visible : styles.hidden}>
				<p>But i'm sure you're more interested in actually playing the game</p>
				<button	onClick={() => JoinGame()}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						>JOIN GAME
				</button>
			</div>

		</div>
	);
}

export default Home