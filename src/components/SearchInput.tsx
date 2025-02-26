import React from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";

const SearchInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ value, onChange }) => {
    return (
        <SearchContainer>
            <StyledTextField
                variant="outlined"
                value={value}
                onChange={onChange}
                placeholder="Search for a Cocktail..."
                autoComplete="off"
            />
            <SearchIcon />
        </SearchContainer>
    );
};

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 20px auto 40px auto;
    justify-content: center;
`;

const StyledTextField = styled(TextField)`
    width: 300px;
    margin: 20px 0;
    background-color: white;
    border-radius: 5px;

    @media (max-width: 768px) {
        width: 100%;
        margin: 10px 0;
    }
`;

export default SearchInput;
