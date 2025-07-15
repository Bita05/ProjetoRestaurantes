import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f5f5f5;
    overflow: hidden;
`;

export const Sidebar = styled.nav`
    width: 200px;
    background-color: #ff7f32; /* Laranja */
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: white;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
`;

export const SidebarBrand = styled.h1`
    font-size: 24px;
    margin: 0;
    cursor: pointer;
    text-align: center;
    margin-bottom: 30px;
`;

export const SidebarMenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const SidebarLink = styled.button`
    background: transparent;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.3s ease;
    text-align: left;
    width: 100%;
    
    &:hover {
        background-color: #e67e22; /* Laranja mais escuro */
        border-radius: 5px;
    }
`;

export const SidebarSeparator = styled.hr`
    margin: 30px 0;
    border: 1px solid #fff;
`;

export const Content = styled.main`
    margin-left: 200px; /* desloca para lado da sidebar fixa */
  padding: 30px;
  height: 100vh; /* altura total da viewport */
  overflow-y: auto; /* scroll só aqui */
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  width: calc(100% - 200px); /* ocupa restante da tela */
  box-sizing: border-box;
`;

export const DashboardTitle = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
`;

export const InfoBox = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    h3 {
        margin-bottom: 15px;
        font-size: 20px;
    }
    p {
        font-size: 16px;
    }
`;

export const Footer = styled.footer`
    background-color: #ff7f32;
    padding: 10px;
    text-align: center;
    color: white;
    margin-top: auto;
    font-size: 14px;
`;



export const FormWrapper = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

// MELHORADO
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 600px) {
    flex-direction: row;
    > div {
      flex: 1;
    }
  }
`;


export const FormTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;



export const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
`;



export const FileInput = styled.input`
  margin-bottom: 20px;
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



export const Input = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #ff7f32;
    box-shadow: 0 0 0 2px rgba(255, 127, 50, 0.2);
  }
`;

// MELHORADO
export const Button = styled.button`
  background-color: #ff7f32;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0671c;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 127, 50, 0.4);
  }
`;

// MELHORADO
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  th, td {
    padding: 14px 16px;
    text-align: left;
  }

  th {
    background-color: #ff7f32;
    color: white;
    font-weight: 600;
    font-size: 16px;
  }

  tbody tr {
    border-bottom: 1px solid #eee;
  }

  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }

  td {
    font-size: 15px;
    color: #333;
  }
`;

// MELHORADO
export const Subtitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #444;
  text-align: center;
`;



export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  width: 100%;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;


export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #555;
  transition: color 0.2s ease;

  &:hover {
    color: #ff7f32;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;



//popup e card reservas
export const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.01);
  }
`;

export const MenuList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;
  list-style-type: disc;
`;

export const MenuItem = styled.li`
  margin-bottom: 6px;
  font-size: 15px;
`;

export const MenuImage = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 8px;
  object-fit: cover;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
`;




// Minha Conta
export const FormWrapperConta = styled.div`
  max-width: 700px;
  margin: 30px auto;
  background: #fff;
  border-radius: 10px;
  padding: 30px 40px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
`;


export const FormTitleConta = styled.h2`
  font-weight: 700;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
`;

export const FormConta= styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
`;

export const InputGroup = styled.div`
  flex: 1 1 48%;
  display: flex;
  flex-direction: column;
`;


export const ImagePreview = styled.img`
  max-width: 110px;
  height: 110px;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  object-fit: cover;
  margin-top: 6px;
  box-shadow: 0 0 6px rgba(0,0,0,0.08);
`;




export const InfoPessoalWrapper = styled.div`
  width: 100%;
  background: #f9fafb;
  border-radius: 10px;
  padding: 20px 25px;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.03);
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
`;


export const ReadOnlyInput = styled(Input)`
  background-color: #e5e7eb;
  cursor: not-allowed;
`;