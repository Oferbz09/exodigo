import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Cocktail {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
}

interface CocktailGridProps {
    cocktails: Cocktail[];
}

const CocktailGrid: React.FC<CocktailGridProps> = ({ cocktails }) => {
    return (
        <CocktailGridContainer>
            {cocktails.length === 0 && <p>No Cocktails Matched</p>}
            {cocktails.map((cocktail) => (
                <CocktailItem key={cocktail.idDrink}>
                    <StyledLink to={`/cocktail/${cocktail.idDrink}`} state={{ cocktail }}>
                        <CocktailImage src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
                        <StyledDrinkName>{cocktail.strDrink}</StyledDrinkName>
                    </StyledLink>
                </CocktailItem>
            ))}
        </CocktailGridContainer>
    );
};

const CocktailGridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    min-height: 480px;
`;

const CocktailItem = styled.div`
    width: 320px;
    height: 320px;
    max-width: 100%;
    margin: 10px;

    @media (max-width: 768px) {
        width: 250px;
        height: 250px;
    }

    @media (max-width: 480px) {
        width: 200px;
        height: 200px;
    }
`;

const StyledLink = styled(Link)`
    display: block;
    text-decoration: none;
    height: 100%;
`;

const CocktailImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
`;

const StyledDrinkName = styled.div`
    color: white;
    text-align: center;
    position: relative;
    z-index: 1;
    font-weight: 600;
    font-size: 12px;
`;

export default CocktailGrid;
