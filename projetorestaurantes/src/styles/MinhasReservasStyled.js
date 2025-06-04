import styled from 'styled-components';


export const Title = styled.h1`
  font-size: 28px;
  text-align: center;
  margin-top: 100px;
  color: #333;
`;

export const ReservasList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const ReservaCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Alinha as informações ao topo */
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 700px; /* Tamanho maior e mais confortável */
  height: auto; /* Ajusta a altura conforme o conteúdo */
  position: relative;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const RestauranteImage = styled.img`
  width: 140px;  /* Ajusta o tamanho da imagem */
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 20px;
`;

export const ReservaDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 35px; /* Espaço para o ícone de cancelamento */
  height: 100%;
`;

export const NomeRestaurante = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;


export const ReservaInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  line-height: 1.5;
`;

export const CancelarButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #ff4d4d;
  position: absolute;
  right: 10px;  /* Posição no canto direito */
  top: 10px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;


export const FilterContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
`;


export const FilterSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  width: 200px;

  &:focus {
    border-color: #f78c40; /* Cor do filtro */
    outline: none;
  }
`;



// Estilo das abas
export const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  border-bottom: 2px solid #ccc;
`;

export const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ active }) => (active ? '#ddd' : 'transparent')};
  border: none;
  border-bottom: ${({ active }) => (active ? '3px solid #333' : 'none')};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #eee;
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