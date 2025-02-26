import React from "react";
import styled from "styled-components";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";



interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page: number) => {
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const maxPagesToShow = 4;
        let startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        const pageNumbers = [];

        if (startPage > 1) {
            pageNumbers.push(<span key="ellipsis1">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <PageButton key={i} onClick={() => handlePageClick(i)} active={currentPage === i}>
                    {i}
                </PageButton>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(<span key="ellipsis2">...</span>);
        }

        return pageNumbers;
    };

    return (
        <PaginationContainer>
            <PageButton onClick={() => handlePageClick(1)} disabled={currentPage === 1}>
                <FaAngleDoubleLeft /> First
            </PageButton>
            <PageButton onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
                <FaAngleLeft /> Prev
            </PageButton>

            {renderPageNumbers()}

            <PageButton onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
                Next <FaAngleRight />
            </PageButton>
            <PageButton onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages}>
                Last <FaAngleDoubleRight />
            </PageButton>
        </PaginationContainer>
    );
};


const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
`;

const PageButton = styled.button<{ disabled?: boolean; active?: boolean }>`
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: ${({ active }) => (active ? "#007bff" : "#f0f0f0")};
    color: ${({ active }) => (active ? "#fff" : "#000")};
    font-weight: bold;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
        background-color: ${({ disabled, active }) =>
    disabled ? "#f0f0f0" : active ? "#0056b3" : "#007bff"};
        color: ${({ disabled }) => (disabled ? "#999" : "#fff")};
    }

    @media (max-width: 768px) {
        padding: 6px 10px;
    }
`;

export default Pagination;
