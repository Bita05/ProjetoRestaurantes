export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: white;
  padding: 30px;
  width: 450px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #ff7f32;
  }
`;

export const StepButton = styled.button`
  background-color: #ff7f32; 
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  margin-top: 20px; 
  cursor: pointer;
  border: none;
  border-radius: 8px; 
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color:rgb(204, 100, 35);
    transform: scale(1.05); 
  }

  &:disabled {
    background-color: #b5b5b5;
    cursor: not-allowed;
  }
`;
