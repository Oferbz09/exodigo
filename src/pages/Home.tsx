import React, {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import axios from "axios";
import CocktailGrid from "../components/CocktailGrid";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import styled from "styled-components";
import {keepPreviousData, useQuery} from "@tanstack/react-query"
import useDebounce from '../hooks/useDebounce'
import {useLocation, useNavigate} from "react-router-dom";

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const ITEM_PER_PAGE = 8;
export interface Cocktail {
    strDrink: string;
    strDrinkThumb: string;
    idDrink:string;
}

const fetchCocktails = async (searchTerm: string): Promise<Cocktail[]> => {
    const response = await axios.get(`${API_URL}${searchTerm}`);
    return Array.isArray(response.data.drinks) ? response.data.drinks : [];
};

const Home = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get("q") || "a";

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(1);
    const [localCocktails, setLocalCocktails] = useState<Cocktail[]>([]);
    const [filteredLocalCocktails, setFilteredLocalCocktails] = useState<Cocktail[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 700);

    useEffect(() => {
        const savedDrinkFromLocal = JSON.parse(localStorage.getItem("my-cocktails") || "[]");
        setLocalCocktails(savedDrinkFromLocal);
    }, []);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setFilteredLocalCocktails(localCocktails);
            return;
        }
        const filtered = localCocktails.filter((drink) =>
            drink.strDrink.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        setFilteredLocalCocktails(filtered);
    }, [debouncedSearchTerm, localCocktails]);

    const { data: cocktails = [], isLoading, isError, error } = useQuery<Cocktail[], Error>({
        queryKey: ['cocktails', debouncedSearchTerm],
        queryFn: () => fetchCocktails(debouncedSearchTerm),
        enabled: !!debouncedSearchTerm,
        placeholderData: keepPreviousData,

    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        navigate(`/?q=${e.target.value}`);
    };

    const totalCocktails = [...filteredLocalCocktails, ...cocktails, ];
    const totalPages = Math.ceil(totalCocktails?.length / ITEM_PER_PAGE);
    const displayedCocktails = totalCocktails?.slice((currentPage - 1) * ITEM_PER_PAGE, currentPage * ITEM_PER_PAGE);

    if (isError) return <span>Error: {error.message}</span>;
    if (isLoading) {
        return <CircularProgress />;
    }

    return (

        <Wrapper>
            <Pagination currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
            />
            <SearchInput value={searchTerm} onChange={handleSearchChange} />
            <CocktailGrid cocktails={displayedCocktails} />
            <Pagination currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
            />
        </Wrapper>

);
};

const Wrapper = styled.div`
    width: 70%;
    height: 100%;
    position: relative;
    padding: 30px 40px;
    margin: 0 auto;

    @media (max-width: 768px) {
        width: 95%;
        padding: 20px 10px;
    }
`;

export default Home;
