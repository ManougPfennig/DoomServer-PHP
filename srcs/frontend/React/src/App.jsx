import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx'
import Doom from './pages/Doom/Doom.jsx'

function App() {

	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route path="/Doom" element={<Doom />} />
					<Route path="*" element={<Home />} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
