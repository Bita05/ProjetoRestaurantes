import styled from 'styled-components';


export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem;
    background-color: #f9f9f9;
    min-height: 100vh;
    font-family: 'Arial', sans-serif;
    width: 100%;
    max-width: 100%;
`;


export const Heading = styled.h1`
    font-size: 3rem;
    font-weight: 700;
    color: #2c3e50;
    margin-top: 1.5rem;
    text-align: center;
`;


export const Image = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;


export const InfoSection = styled.section`
    font-size: 1.2rem;
    color: #34495e;
    margin-top: 1rem;
`;


export const RatingContainer = styled.section`
    padding: 1rem;
    margin-left: 2rem;
    text-align: center;

    h3 {
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #2c3e50;
    }

    .rating-stars {
        font-size: 2rem;
        margin: 10px 0;
        color: #f39c12;
    }
`;


export const MenuSection = styled.section`
    width: 100%;
    max-width: 900px;
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #ecf0f1;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    
    h3 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #2c3e50;
    }
`;

export const Carousel = styled.div`
    display: flex;
    overflow-x: scroll;
    gap: 15px;
    padding: 20px 0;
    `;

export const CarouselItem = styled.div`
    flex: 0 0 auto; /* Faz com que os itens tenham um tamanho fixo e não se expandam */
    width: 150px; /* Tamanho ajustado para que o carrossel fique mais compacto */
    height: auto;
    text-align: center;

    img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    }

    p {
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    }

    span {
    font-size: 12px;
    color: #f39c12;
    }
    `;


export const ReserveSection = styled.div`
    text-align: center;
    margin-top: 3rem;

    h3 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 1rem;
    }
`;

export const ReserveButton = styled.button`
    background-color: #ff7f32;
    color: #fff;
    font-size: 1.2rem;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color:rgb(204, 100, 35)
    }
`;


export const DetailsSection = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    width: 100%;
`;

export const LeftDetails = styled.div`
    width: 48%;
    background-color: #f4f4f4;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;

    h3 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #2c3e50;
    }
`;

export const RightDetails = styled.div`
    width: 48%;
    background-color: #f4f4f4;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;

    h3 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #2c3e50;
    }
`;

export const MapSection = styled.section`
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;


export const Footer = styled.footer`
    text-align: center;
    padding: 1rem;
    background-color: #ff7f32;
    color: #fff;
    font-size: 1rem;
    width: 100%;  
    position: relative; 
    bottom: 0;
    margin: 0;  
    box-sizing: border-box;  
`;


export const InfoImageContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 2rem;
`;

export const LeftSide = styled.div`
    width: 50%; /* Garante que ocupe 50% */
    padding-right: 10px; /* Ajuste de padding para equilíbrio */
`;

export const RightSide = styled.div`
    width: 50%; /* Garante que ocupe 50% */
    padding-left: 10px; /* Ajuste de padding para equilíbrio */
`;





