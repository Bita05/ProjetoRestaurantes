import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
`;

export const FormWrapper = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

export const FormTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #0056b3;
  }
`;

export const FileInput = styled.input`
  margin-bottom: 20px;
`;

export const Button = styled.button`
  background-color: #ff7f32;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #e67e22;
  }
  &:focus {
    outline: none;
  }
`;

export const BackButton = styled.button`
  background-color:rgb(122, 119, 116);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color:rgb(66, 65, 64);
  }
  &:focus {
    outline: none;
  }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #ff7f32; /* Laranja */
        color: white;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }

    td {
        font-size: 16px;
    }
`;