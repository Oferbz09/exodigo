import { Link } from "react-router-dom";
import styled from "styled-components";

const Header = () => (
    <StyledHeader>
        <ImgContainer>
            <img alt="exodigo" src={"https://cdn.prod.website-files.com/61a4a1d499aa5e3c162158a1/636ab46b2afef8c11f7acfc5_exodigo-main-logo-white.webp"}/>
        </ImgContainer>

            <Nav>
                <StyledLink to="/">Home</StyledLink>
                <StyledLink to="/add">Add Cocktail</StyledLink>
            </Nav>

    </StyledHeader>
);


const StyledHeader = styled.header`
    background-color: #000;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid;

    @media (max-width: 768px) {
        flex-direction: column; 
        align-items: flex-start; 
    }
`;

const ImgContainer = styled.div`
    position: relative;
    width: fit-content;
    height: auto;
    
    
    img{
        width: 100%;
        height: auto;
        object-fit: contain;
    }

`;

const Nav = styled.nav`
    display: flex;
    gap: 20px; 
`;

const StyledLink = styled(Link)`
    color: white;
    text-decoration: none;
    margin-left: 15px;
    margin-right: 15px;
    padding: 5px 0;
    font-size: 30px;
    line-height: 20px;

    &:hover {
        text-decoration: underline; 
    }
`;
export default Header;
