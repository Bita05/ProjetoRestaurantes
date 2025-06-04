import styled from 'styled-components';

// cainter principal
export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

// Título
export const MenuTitle = styled.h2`
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
`;

// Grid de cards
export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

// cards
export const MenuCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .details {
    padding: 15px;
    text-align: center;
  }

  h3 {
    font-size: 20px;
    color: #ff6600;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

// Botão add
export const AddMenuButton = styled.button`
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  transition: background 0.3s;

  &:hover {
    background-color: #e55b00;
  }

  svg {
    font-size: 20px;
  }
`;



export const ActionButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 20px;
    margin: 5px;
    color: #333;
    transition: color 0.3s;

    &:hover {
        color: #ff6347; /* Cor de hover (opcional) */
    }
`;


export const MenuReservasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
`;

export const ReservaCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;


