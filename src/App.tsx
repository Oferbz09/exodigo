import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from "./pages/Home";
import CocktailDetail from "./pages/CocktailDetail";
import AddCocktail from "./pages/AddCocktail.tsx";
import styled from "styled-components";

import './App.css'

const App = () => {
    return (
        <Router>
            <Header />
            <Container>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cocktail/:id" element={<CocktailDetail />} />
                <Route path="/add" element={<AddCocktail />} />
            </Routes>
            </Container>
        </Router>
    );
};

const Container = styled.div`
    margin: 0 auto;
    padding: 30px;
`;


export default App;
