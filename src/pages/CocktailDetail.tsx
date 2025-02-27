import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Chip, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import BackButton from "../components/BackButtons";

const DRINK_URL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
const PLACEHOLDER_IMAGE = "https://dummyimage.com/320x320/cccccc/000000&text=No+Image";

type Cocktail = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strInstructions: string;
    strTags: string;
    strCategory: string

};

type Ingredient = {
    ingredient: string;
    measure: string;
};

const CocktailDetail = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    const initialCocktail: Cocktail | null = location.state?.cocktail || null;
    const [cocktail, setCocktail] = useState<Cocktail | null>(initialCocktail);
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        const fetchCocktail = async () => {
            setLoading(true);
            let drink = cocktail;

            if (!drink) {
                const cachedCocktail = localStorage.getItem(`cocktail-${id}`);
                if (cachedCocktail) {
                    drink = JSON.parse(cachedCocktail);
                    setCocktail(drink);
                } else {
                    try {
                        const response = await axios.get(`${DRINK_URL}${id}`);
                        drink = response.data.drinks ? response.data.drinks[0] : null;
                        setCocktail(drink);
                    } catch (error) {
                        console.error("Error fetching cocktail details", error);
                    }
                }
            }

            if (drink) {
                const combinedIngredients: Ingredient[] = [];
                let i = 1;
                while (drink[`strIngredient${i}` as keyof Cocktail]) {
                    combinedIngredients.push({
                        ingredient: (drink[`strIngredient${i}` as keyof Cocktail] || "") as string,
                        measure: (drink[`strMeasure${i}` as keyof Cocktail] || "") as string
                    });
                    i++;
                }
                setIngredients(combinedIngredients);
                if (!initialCocktail) {
                    localStorage.setItem(`cocktail-${id}`, JSON.stringify(drink));
                }
            }
            setLoading(false);
        };
        fetchCocktail();
    }, [id, initialCocktail, cocktail]);

    if (loading) return <CircularProgress />;
    if (!cocktail) return <Typography>No Cocktail Found.</Typography>;

    return (
        <>
            <BackButton />
            <Typography className={"cocktail-title"} variant="h2">{cocktail.strDrink}</Typography>
            <ContentWrapper>
                <CocktailImageContainer>
                    <CocktailImage src={cocktail.strDrinkThumb || PLACEHOLDER_IMAGE} alt={cocktail.strDrink} />
                </CocktailImageContainer>
                <Ingredients>
                    <StyledTitle>Ingredients</StyledTitle>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <IngredientItem key={index}>
                                {ingredient.ingredient}
                                {ingredient.measure && <span style={{ fontSize: "14px", padding: "0 10px" }}>
                                    ({ingredient.measure})

                                </span>
                                }
                            </IngredientItem>
                        ))}
                    </ul>
                </Ingredients>
            </ContentWrapper>
            {cocktail.strTags && (
                <StyledCategory>
                    <StyledTitle>Tags</StyledTitle>
                    {cocktail.strTags.split(",").map((tag, index) => (
                        <Chip className={'chip-tag'} key={index} label={tag} variant="outlined" />
                    ))}
                </StyledCategory>
            )}
            {cocktail.strCategory && (
                <StyledCategory>
                    <StyledTitle>Category</StyledTitle>
                    <Typography variant="h5">{cocktail.strCategory}</Typography>
                </StyledCategory>
            )}
            <Instructions>
                <StyledTitle>Instructions</StyledTitle>
                <Typography variant="h5">{cocktail.strInstructions}</Typography>
            </Instructions>
        </>
    );
};

const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    width: 100%;
    margin-top: 20px;
    align-items: stretch;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: left;
    }
    
    .cocktail-title{
        width: 100%;
        line-break: anywhere;
    }
`;

const CocktailImageContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 400px;
    height: 400px;
    position: relative;
    margin: 20px auto;
    @media (max-width: 768px) {
        width: 320px;
        height: 320px;
    }
    @media (max-width: 380px) {
        width: 200px;
        height: 200px;
    }
`;

const CocktailImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
    position: absolute;
`;

const Ingredients = styled.div`
    flex: 1;
    margin: 0 20px;
    color: white;
    @media (max-width: 768px) {
        flex-direction: column;
        margin: 0;
    }
    
    ul {
        list-style: none;
        padding: 0;
    }
    
`;

const IngredientItem = styled.li`
    font-size: 24px;
    padding: 5px 0;
`;

const StyledCategory = styled.div`
    margin: 20px 0;
    color: white;
    
    .chip-tag {
        color: white;
        font-size: 22px;
        display: inline-flex;
        position: relative;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        padding: 13px;
        margin: 15px 10px 0 0;
    }
`;

const Instructions = styled.div`
    width: fit-content;
    margin-top: 30px;
    padding: 20px 0;
    color: white;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledTitle = styled.div`
    font-size: 40px;
    text-decoration: underline;
`;

export default CocktailDetail;
