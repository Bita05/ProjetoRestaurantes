import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, Content, DashboardTitle, InfoBox, Footer, SidebarSeparator, InfoBoxAdmin, InfoBoxAdminTitle, InfoBoxAdminText,
  InfoBoxAdminRestaurantesTitle, InfoBoxAdminRestaurantesText, InfoBoxAdminRestaurantesSubText, InfoBoxAdminClientesTitle, InfoBoxAdminClientesText, InfoBoxAdminClientesSubText
} from '../../styles/HomeRestauranteStyled';
import { ModalSair, ModalSairContent, ModalTitle, ModalButtons, CancelButton, ConfirmButton } from '../../styles/PopUpSair';
import { FaTachometerAlt, FaSignOutAlt, FaUser, FaClipboardCheck, FaStore } from 'react-icons/fa';


const AdminPedidosDeRegisto = () => {
  const [user, setUser] = useState(null);
  const [pendentes, setPendentes] = useState(0);
  const [numRestaurantes, setNumRestaurantes] = useState(0);
  const [numClientes, setnumClientes] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const confirmLogout = () => setShowLogoutModal(true);
  const LogoutCancelled = () => setShowLogoutModal(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    if (!loggedUser || loggedUser.tipo !== 'admin') {
      navigate('/login');
      return;
    }
    setUser(loggedUser);

  }, [navigate]);

  useEffect(() => {
    const fetchContagemPendentes = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/ObteredidosPendentes');
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setPendentes(data.pedidos[0].pedidos_pendetes || 0);
        }
      } catch (error) {
        console.error('Erro ao procurar pedidos pendentes:', error);
      }
    };

    fetchContagemPendentes();
  }, []);



  useEffect(() => {
    const fetchContagemRestaurantes = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/ObterNumRestaurantes');
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setNumRestaurantes(data.num_restaurantes[0].num_restaurantes || 0);
        }
      } catch (error) {
        console.error('Erro ao procurar contagem de restaurantes:', error);
      }
    };

    fetchContagemRestaurantes();
  }, []);


  useEffect(() => {
    const fetchContagemClientes = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/ObterNumClientes');
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setnumClientes(data.num_clientes[0].num_clientes || 0);
        }
      } catch (error) {
        console.error('Erro ao procurar contagem de restaurantes:', error);
      }
    };

    fetchContagemClientes();
  }, []);


  const handleDashboard = () => {
    navigate('/admin/HomeAdmin');
  };

  const handleRegistos = () => {
    navigate('/admin/adminPedidosRegisto');
  };

  const handleUtilizadores = () => {
    navigate('/admin/adminUtilizadores');
  };

  const LogoutConfirm = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container>
      <Sidebar>
        <SidebarBrand>Administrador</SidebarBrand>

        <SidebarMenu>
          <SidebarLink onClick={handleDashboard}>
            <FaTachometerAlt /> Dashboard
          </SidebarLink>
          <SidebarLink onClick={handleRegistos}>
            <FaClipboardCheck /> Registos
          </SidebarLink>
          <SidebarLink onClick={handleUtilizadores}>
            <FaUser /> Utilizadores
          </SidebarLink>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarMenu>
          <SidebarLink onClick={confirmLogout}><FaSignOutAlt /> Sair</SidebarLink>
        </SidebarMenu>
      </Sidebar>

      <Content>
        <div>
          <DashboardTitle>Painel de Administração</DashboardTitle>
          <table>
            <tr>
              <td>
                <InfoBoxAdmin>
                  <InfoBoxAdminTitle>
                    <FaClipboardCheck style={{ fontSize: '30px', marginRight: '10px' }} />
                    Pedidos Pendentes
                  </InfoBoxAdminTitle>
                  <InfoBoxAdminText>{pendentes}</InfoBoxAdminText>
                  <InfoBoxAdminRestaurantesSubText>Total de restaurantes pendentes</InfoBoxAdminRestaurantesSubText>
                  {pendentes === 0 && <p style={{ color: '#7f8c8d' }}>Nenhum pedido aguardando aprovação.</p>}
                </InfoBoxAdmin>
              </td>
              <td>
                <InfoBoxAdmin>
                  <InfoBoxAdminRestaurantesTitle>
                    <FaStore style={{ fontSize: '30px' }} />
                    Restaurantes Registados
                  </InfoBoxAdminRestaurantesTitle>
                  <InfoBoxAdminRestaurantesText>{numRestaurantes}</InfoBoxAdminRestaurantesText>
                  <InfoBoxAdminRestaurantesSubText>Total de restaurantes no sistema</InfoBoxAdminRestaurantesSubText>
                  {numRestaurantes === 0 && <p style={{ color: '#7f8c8d' }}>Nenhum restaurante registado</p>}
                </InfoBoxAdmin>
              </td>
              <td>
                <InfoBoxAdmin>
                  <InfoBoxAdminClientesTitle>
                    <FaUser style={{ fontSize: '30px' }} />
                    Clientes Registados
                  </InfoBoxAdminClientesTitle>
                  <InfoBoxAdminClientesText>{numClientes}</InfoBoxAdminClientesText>
                  <InfoBoxAdminRestaurantesSubText>Total de clientes no sistema</InfoBoxAdminRestaurantesSubText>
                  {numClientes === 0 && <p style={{ color: '#7f8c8d' }}>Nenhum cliente registado</p>}
                </InfoBoxAdmin>
              </td>
            </tr>
          </table>
        </div>
      </Content>
      <Footer>&copy; 2025 Administrador - Todos os direitos reservados</Footer>


      {showLogoutModal && (
        <ModalSair>
          <ModalSairContent>
            <ModalTitle>Terminar Sessão</ModalTitle>
            <p>Tem a certeza que deseja sair?</p>
            <ModalButtons>
              <CancelButton onClick={LogoutCancelled}>Cancelar</CancelButton>
              <ConfirmButton onClick={LogoutConfirm}>Sair</ConfirmButton>
            </ModalButtons>
          </ModalSairContent>
        </ModalSair>
      )}
    </Container>
  );
};

export default AdminPedidosDeRegisto;