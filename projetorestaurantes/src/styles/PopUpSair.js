import styled from 'styled-components';

export const ModalSair = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

export const ModalSairContent = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: 300px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
`;

export const ModalTitle = styled.h3`
    margin-bottom: 1rem;
    font-size: 1.25rem;
`;

export const ModalButtons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
`;

export const CancelButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 6px;
    background: #ccc;
    border: none;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        background: #b3b3b3;
    }
`;

export const ConfirmButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 6px;
    background: #f18f45;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;

    &:hover {
        background: #f2a365;
    }
`;
