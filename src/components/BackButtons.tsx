import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BackButton = () => {
    const navigate = useNavigate();
    return <Button onClick={() => navigate(-1)}>← Back</Button>;
};

const Button = styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    &:hover {
        text-decoration: underline;
    }
`;

export default BackButton;
