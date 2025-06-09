import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';  

export const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
  min-height: 100vh;
  padding: 0;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f78c40;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  flex-wrap: wrap;  /* Permite quebrar a linha */

  /* Ajuste para telas menores */
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 15px;
  }

  /* Ajustar os divs filhos para mobile */
  > div {
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 600px) {
      width: 100%;
      justify-content: space-between;
    }
  }
`;


export const UserSection = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 18px;

  svg {
    margin-right: 10px;
    font-size: 22px;
  }

  @media (max-width: 600px) {
    font-size: 16px;

    svg {
      font-size: 18px;
      margin-right: 6px;
    }
  }
`;

export const Banner = styled.div`
  background-image: url('/img/banner.jpg');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 60px;
  padding: 0 20px;
  z-index: 5;
`;

export const LogoutButton = styled.button`
  background-color: #ff5f5f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #ff3f3f;
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const SettingsButton = styled.button`
  background-color: #f2a365;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #f18f45;
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 20px;  /* Adicionando espaçamento nas laterais */
  margin-top: 100px;  /* Para não colidir com o banner fixo */
  max-width: 1200px;  /* Limita a largura máxima para evitar que fique muito esticado */
  margin-left: auto;  /* Centraliza a grid */
  margin-right: auto;  /* Centraliza a grid */
`;

export const RestaurantCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .details {
    padding: 15px;
  }

  h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

export const Button = styled.button`
  background-color: #ff7f32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgb(204, 100, 35);
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;


export const ButtonVoltar = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 1rem;
  background-color: #ff7f32;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  max-width: 140px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e67329;
  }
`;


export const PopularSection = styled.div`
  margin-top: 10rem; 
`;


export const Footer = styled.footer`
  background-color: #ff7f32;
  color: white;
  padding: 15px 0;
  text-align: center;
  font-size: 14px;
  margin-top: 3rem;
`;