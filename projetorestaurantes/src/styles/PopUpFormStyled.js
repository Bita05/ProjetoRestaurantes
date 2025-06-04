import styled from 'styled-components';


export const ModalForm = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Fundo translúcido */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Garante que o modal fique acima do conteúdo */
`;


export const ModalFormContent = styled.div`
  background-color: white;
  padding: 20px;
  width: 50%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
`;


export const CloseFormButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  &:hover {
    color: #e74c3c;
  }
`;


export const ModalFormTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;


export const ModalFormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;


export const ModalFormButton = styled.button`
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }

  &:not(:last-child) {
    background-color: #dc3545;
  }
  
  &:not(:last-child):hover {
    background-color: #c82333;
  }
`;

export const GeneratePasswordFormButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  
  &:hover {
    background-color: #0056b3;
  }
`;


export const ModalFormLabel = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
`;

