import styled from 'styled-components';

// container para centrar
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

// form
export const FormWrapper = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

// Título
export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

// inputs
export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

// Botão submit
export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ff7f32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color:rgb(204, 100, 35)
  } 
`;

// Mensagem de erro
export const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 14px;
`;

// Mensagem de sucesso
export const SuccessMessage = styled.p`
  color: green;
  text-align: center;
  font-size: 14px;
`;

// Link
export const RegisterLink = styled.div`
  text-align: center;
  margin-top: 15px;
  
  button {
    background-color: transparent;
    color: #007bff;
    border: none;
    cursor: pointer;
    text-decoration: underline;
  }
  
  button:hover {
    color: #0056b3;
  }
`;

