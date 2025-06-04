import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f5f5f5;
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
    position: sticky;
    top: 0;
    height: 100vh;
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
    display: flex;
    flex-grow: 1;
    padding: 30px;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
`;

export const DashboardTitle = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
`;

export const InfoBox = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;


export const RestauranteInfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const RestauranteName = styled.h3`
    font-size: 28px;
    font-weight: bold;
    color: #333;
`;

export const StatusText = styled.p`
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => (props.isOpen ? 'green' : 'red')};
    margin: 0;
`;

export const RestauranteDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const RestauranteDescription = styled.p`
    font-size: 16px;
    color: #666;
`;

export const RestauranteLocation = styled.p`
    font-size: 16px;
    color: #444;
    margin: 0;
`;

export const RestauranteSchedule = styled.p`
    font-size: 16px;
    color: #444;
    margin: 0;
`;

export const StatusBadge = styled.div`
    background-color: ${(props) => (props.isOpen ? '#16a085' : '#e74c3c')};
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 1px;
`;

export const Footer = styled.footer`
    background-color: #ff7f32;
    padding: 10px;
    text-align: center;
    color: white;
    margin-top: auto;
    font-size: 14px;
`;


//Card Dashboard
export const CardNumReservas = styled.div`
    background-color: #ff7f32; /* Cor de fundo */
    border-radius: 10px;       /* Bordas arredondadas */
    padding: 20px;             /* Padding para dar espaço interno */
    width: 250px;              /* Largura do card */
    height: 200px;             /* Altura do card */
    display: flex;             /* Flexbox para centralizar conteúdo */
    flex-direction: column;    /* Organiza conteúdo verticalmente */
    justify-content: space-between; /* Espaça os elementos dentro do card */
    align-items: center;       /* Centraliza conteúdo horizontalmente */
    margin-top: 20px;          /* Espaço superior */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombras para dar profundidade */
    text-align: center;        /* Centraliza o texto dentro do card */
`;

export const ReservasContent = styled.div`
    display: flex;             /* Usa flexbox para distribuir os itens */
    flex-direction: column;    /* Organiza os itens verticalmente */
    justify-content: center;   /* Centraliza verticalmente */
    align-items: center;       /* Centraliza horizontalmente */
    width: 100%;               /* Ocupa toda a largura disponível */
    height: 100%;              /* Ocupa toda a altura do card */
`;

export const ReservasNumber = styled.span`
    font-size: 3em;            /* Tamanho grande para o número */
    font-weight: bold;         /* Negrito para destaque */
    color: #fff;               /* Cor do número */
    margin-top: 10px;          /* Espaço entre o ícone e o número */
`;

export const ReservasText = styled.span`
    font-size: 1.2em;          /* Tamanho do texto */
    color: #fff;               /* Cor do texto */
    margin-top: 10px;          /* Espaço entre o ícone e o texto */
    display: block;            /* Faz com que o texto ocupe a linha inteira */
`;

export const IconContainer = styled.div`
    background-color: #ff7f32; /* Cor de fundo para o ícone */
    padding: 10px;             /* Padding ao redor do ícone */
    border-radius: 50%;        /* Deixa o ícone circular */
    color: white;              /* Cor do ícone */
    font-size: 30px;           /* Tamanho do ícone */
    display: flex;             /* Flexbox para centralizar o ícone */
    justify-content: center;   /* Centraliza o ícone horizontalmente */
    align-items: center;       /* Centraliza o ícone verticalmente */
`;



export const CapacidadeCard = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
    margin-bottom: 20px;
`;

export const DiaSemanaTitle = styled.h4`
    margin-bottom: 10px;
    color: #333;
`;

export const HorarioCard = styled.div`
    background-color: #f7f7f7;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const HorarioText = styled.p`
    font-size: 14px;
    color: #333;
    margin: 5px 0;
    font-weight: bold;
`;

export const HorarioLabel = styled.span`
    font-weight: bold;
`;

// Layout para agrupar os cards por dia
export const CapacidadeContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: start;
`;




export const InfoBoxAdmin = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 20px;  
  text-align: center;   
  max-width: 400px;   
  margin-bottom: 20px; 
`;

export const InfoBoxAdminTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center; 
  font-size: 24px;
  color: #f39c12;
  margin-bottom: 10px;
`;

export const InfoBoxAdminText = styled.p`
  font-size: 40px;
  font-weight: bold;
  color: #e74c3c;
  margin: 0; 
`;




export const InfoBoxAdminRestaurantesTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center; 
  font-size: 24px;
  color: #3498db;
  margin-bottom: 10px;
`;

export const InfoBoxAdminRestaurantesText = styled.p`
  font-size: 40px;
  font-weight: bold;
  color: #2980b9;
  margin: 0;
`;

export const InfoBoxAdminRestaurantesSubText = styled.p`
  color: #7f8c8d;
  font-size: 16px;
`;


export const InfoBoxAdminClientesTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center; 
  font-size: 24px;
  color:rgb(32, 179, 76);
  margin-bottom: 10px;
`;

export const InfoBoxAdminClientesText = styled.p`
  font-size: 40px;
  font-weight: bold;
  color:rgb(32, 179, 76);
  margin: 0;
`;

export const InfoBoxAdminClientesSubText = styled.p`
  color: #7f8c8d;
  font-size: 16px;
`;



//Admin Utilizadores
export const TableUtilizadoresWrapper = styled.div`
  margin-bottom: 20px;
  width: 100%;
  overflow-x: auto; /* para responsividade */
`;

export const TableUtilizadores = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    background-color: #ff7f32;
    color: white;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  color: #ff7f32;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;

  &:hover {
    color: #e67e22;
  }
`;

export const ErrorText = styled.p`
  color: red;
  margin-bottom: 15px;
  font-weight: 600;
`;


//Admin Pedidos

// Estilos para a tabela e botões da página de Pedidos (Pedidos)
export const PedidosWrapper = styled.div`
  width: 100%;
  overflow-x: auto; /* responsividade para tabelas largas */
  margin-top: 20px;
`;

export const PedidosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);

  thead {
    background-color: #ff7f32; /* Laranja */
    color: white;
  }

  th, td {
    padding: 15px 20px;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-size: 16px;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const PedidosLinkDocumento = styled.a`
  background-color: #3498db;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

export const PedidosButton = styled.button`
  background-color: ${(props) => (props.variant === 'danger' ? '#e74c3c' : '#1ab394')};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.variant === 'danger' ? '#c0392b' : '#16a085')};
  }
`;

export const PedidosActions = styled.div`
  display: flex;
  align-items: center;
`;
