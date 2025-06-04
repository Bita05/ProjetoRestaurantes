import styled, { keyframes }  from 'styled-components';



const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Modal
export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

export const ModalContent = styled.div`
  width: 90%;
  max-width: 800px;
  max-height: 90vh; /* Impede que fique muito alto */
  overflow-y: auto; /* Scroll interno */
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.4s ease-out;


    min-height: 500px; // mantém altura estável
    overflow-y: auto;
    transition: min-height 0.3s ease-in-out;

    @media (max-width: 768px) {
        padding: 1.5rem;
        min-height: 400px;
    }

    @media (max-width: 480px) {
        padding: 1rem;
        min-height: 350px;
    }
`;

export const StepButton = styled.button`
    width: 100%;
    padding: 12px;
    background: linear-gradient(90deg, #ff7f32, #ff924d);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(90deg, #cc6423, #e06e2c);
    }

    &:disabled {
        background-color: #e0e0e0;
        color: #999;
        cursor: not-allowed;
    }
`;


export const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 1.75rem;
    color: #888;
    cursor: pointer;

    &:hover {
        color: #333;
    }
`;


export const HorarioButton = styled.button`
    background-color: ${props => (props.isSelecionado ? '#ff7f32' : '#f8f9fa')};
    color: ${props => (props.isSelecionado ? '#fff' : '#000')};
    border: 1px solid ${props => (props.isSelecionado ? '#ff7f32' : '#ddd')};
    border-radius: 5px;
    padding: 10px;
    margin: 5px;
    cursor: pointer;
    box-sizing: border-box;

    font-size: 0.95rem;
    min-height: 48px;
    line-height: 1.2;
    word-wrap: break-word;
    white-space: normal;
    text-align: center;

    &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }

    &:hover {
        background-color: ${props => (props.isSelecionado ? '#CC6423' : '#f1f1f1')};
    }

    @media (max-width: 768px) {
        width: calc(50% - 10px);
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`;


export const MenuList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;

  /* Optional: nice scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
  max-height: 300px;
}

@media (max-height: 600px) {
  max-height: 250px;
}
`;

export const MenuCard = styled.div`
  width: 45%;
  min-height: 180px;   
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;  
  cursor: pointer;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
  }
`;

export const MenuImage = styled.img`
  width: 120px;
  height: 120px;  
  object-fit: cover;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  align-self: flex-start;
`;

export const MenuDetails = styled.div`
  padding: 10px;
  flex: 1;                 
  display: flex;
  flex-direction: column;
  justify-content: space-between;  
`;

export const MenuTitle = styled.h3`
  font-size: 1rem;      
  margin-bottom: 5px;
  white-space: nowrap;  
  overflow: hidden;
  text-overflow: ellipsis; 
`;

export const MenuDescription = styled.p`
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const MenuPrice = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #ff7f32;
  margin-top: auto;     
`;

export const SelectMenuButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: ${({ isSelecionado }) => (isSelecionado ? '#7d7a77' : '#ff7f32')};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ isSelecionado }) => (isSelecionado ? '#7d7a77' : '#CC6423')};
  }
`;
export const NavigationArrow = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 2rem;
    padding: 10px;
    cursor: pointer;
    border-radius: 50%;
    z-index: 1002;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    &:disabled {
        cursor: not-allowed;
        background-color: rgba(0, 0, 0, 0.3);
    }

    ${props => (props.left ? `left: 20px;` : `right: 20px;`)}
`;

export const NavigationContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const ProgressBar = styled.div`
    width: 100%;
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1.5rem;
`;

export const ProgressFill = styled.div`
    height: 100%;
    background-color: #ff7f32;
    transition: width 0.3s ease;
    width: ${props => props.width || '0%'};
`;