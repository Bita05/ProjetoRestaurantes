import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaCog, FaSignOutAlt, FaUser, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Container, Header, Banner, Button, LogoutButton, SettingsButton, UserSection } from '../../styles/HomeStyled';
import { ModalSair, ModalSairContent, ModalTitle, ModalButtons, CancelButton, ConfirmButton } from '../../styles/PopUpSair';
import { Title, ReservasList, ReservaCard, RestauranteImage, ReservaDetails, NomeRestaurante, ReservaInfo, CancelarButton, FilterContainer, FilterSelect, TabsContainer, Tab, ButtonVoltar } from '../../styles/MinhasReservasStyled';



const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [reservasCanceladas, setReservasCanceladas] = useState([]);
  const [reservasPassadas, setReservasPassadas] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [filterOrder, setFilterOrder] = useState('asc');
  const [activeTab, setActiveTab] = useState('ativas');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const confirmLogout = () => setShowLogoutModal(true);
  const LogoutCancelled = () => setShowLogoutModal(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const navigate = useNavigate();

  const fetchReservas = async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:8080/obterReservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_utilizador: user.id }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setReservas(data.reservas);
      } else {
        console.error('Erro ao carregar reservas:', data.error);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const fetchReservasCanceladas = async () => {
    try {
      const response = await fetch('http://localhost:8080/obterReservasCanceladas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_utilizador: user.id }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setReservasCanceladas(data.reservas);
      } else {
        console.error('Erro ao carregar reservas canceladas:', data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas canceladas:', error);
    }
  };

  const fetchReservasPassadas = async () => {
    try {
      const response = await fetch('http://localhost:8080/obterReservasPassadas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_utilizador: user.id }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setReservasPassadas(data.reservas);
      } else {
        console.error('Erro ao carregar reservas passadas:', data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas passadas:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchReservas();
  }, [navigate, user]);

  useEffect(() => {
    if (activeTab === 'canceladas') {
      fetchReservasCanceladas();
    }
    if (activeTab === 'passadas') {
      fetchReservasPassadas();
    }
  }, [activeTab]);

  const calcularPrecoTotal = (menus) => {
    if (Array.isArray(menus) && menus.length > 0) {
      return menus.reduce((total, menu) => total + (parseFloat(menu.preco) || 0), 0);
    }
    return 0;
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setFilterOrder(order);

    setReservas((prevReservas) => {
      const sorted = [...prevReservas];
      sorted.sort((a, b) => {
        const precoA = calcularPrecoTotal(a.menus);
        const precoB = calcularPrecoTotal(b.menus);
        return order === 'asc' ? precoA - precoB : precoB - precoA;
      });
      return sorted;
    });
  };

  const cancelarReserva = async (idReserva) => {
    const confirm = window.confirm('Tem a certeza que deseja cancelar esta reserva?');
    if (!confirm) return;

    try {
      const response = await fetch('http://localhost:8080/cancelarReserva', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_reserva: idReserva }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        //alert('Reserva cancelada com sucesso!');
        showMessage('Reserva Cancelada com sucesso', 'success')
        setReservas((prevReservas) =>
          prevReservas.filter((reserva) => reserva.id_reserva !== idReserva)
        );
        //fetchReservas();
      } else {
        //alert(data.error || 'Erro ao cancelar a reserva.');
        showMessage(data.error || 'Não foi possível cancelar a reserva!', 'error')
      }
    } catch (error) {
      console.error('Erro ao cancelar a reserva:', error);
      //alert('Erro na comunicação com o servidor.');
      showMessage('Erro no servidor!', 'error')
    }
  };

   const LogoutConfirm = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

  const showMessage = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Header>
        <div>
          {user ? (
            <UserSection>
              <FaUser />
              <span>{user.nome}</span>
            </UserSection>
          ) : (
            <Button onClick={() => navigate('/restaurantes/pedidoDeRegisto')}>
              Pretende registar o seu restaurante?
            </Button>
          )}
        </div>

        <div>
          {user ? (
            <>
              <Button onClick={() => navigate('/clientes/minhas-reservas')}>Minhas Reservas</Button>
              <SettingsButton onClick={() => navigate('/clientes/clientesDefinicoes')}>
                <FaCog />
              </SettingsButton>
              <LogoutButton onClick={confirmLogout}>
                <FaSignOutAlt />
              </LogoutButton>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/register')}>Registar</Button>
              <Button onClick={() => navigate('/login')}>Iniciar Sessão</Button>
            </>
          )}
        </div>
      </Header>

      <Banner>Minhas Reservas</Banner>
      <ButtonVoltar onClick={() => navigate('/clientes/home')}>
        <FaArrowLeft size={18} />
        Voltar
      </ButtonVoltar>

      <Title>Minhas Reservas</Title>

      <TabsContainer>
        <Tab active={activeTab === 'ativas'} onClick={() => setActiveTab('ativas')}>
          Reservas Ativas
        </Tab>
        <Tab active={activeTab === 'canceladas'} onClick={() => setActiveTab('canceladas')}>
          Reservas Canceladas
        </Tab>
        <Tab active={activeTab === 'passadas'} onClick={() => setActiveTab('passadas')}>
          Reservas Passadas
        </Tab>
      </TabsContainer>

      {activeTab === 'ativas' && (
        <>
          <FilterContainer>
            <FilterSelect onChange={handleSortChange}>
              <option value="asc">Preço mais baixo</option>
              <option value="desc">Preço mais alto</option>
            </FilterSelect>
          </FilterContainer>

          {reservas.length > 0 ? (
            <ReservasList>
              {reservas.map((reserva) => {
                const precoTotal = calcularPrecoTotal(reserva.menus);
                return (
                  <ReservaCard key={reserva.id_reserva}>
                    <RestauranteImage
                      src={`data:image/jpeg;base64,${reserva.imagem_restaurante}`}
                      alt={reserva.restaurante}
                    />
                    <ReservaDetails>
                      <NomeRestaurante>{reserva.restaurante}</NomeRestaurante>
                      <ReservaInfo>
                        {reserva.dia_semana} - {reserva.hora_inicio} a {reserva.hora_fim}
                      </ReservaInfo>
                      <ReservaInfo>Localização: {reserva.localizacao}</ReservaInfo>
                      <ReservaInfo>
                        Menus: {reserva.menus?.map((menu) => menu.nome_prato).join(', ') || 'N/A'}
                      </ReservaInfo>
                      <ReservaInfo>Preço Total: €{precoTotal.toFixed(2)}</ReservaInfo>
                      <ReservaInfo>Número de pessoas: {reserva.num_pessoas}</ReservaInfo>
                      <ReservaInfo>Data da reserva: {reserva.data_reserva_marcada}</ReservaInfo>

                      <CancelarButton onClick={() => cancelarReserva(reserva.id_reserva)}>
                        <FaTrash />
                      </CancelarButton>
                    </ReservaDetails>
                  </ReservaCard>
                );
              })}
            </ReservasList>
          ) : (
            <p>Você não tem reservas ativas.</p>
          )}
        </>
      )}

      {activeTab === 'canceladas' && (
        <>

          {reservasCanceladas.length > 0 ? (
            <ReservasList>
              {reservasCanceladas.map((reserva) => {
                const precoTotal = calcularPrecoTotal(reserva.menus);
                return (
                  <ReservaCard key={reserva.id_reserva}>
                    <RestauranteImage
                      src={`data:image/jpeg;base64,${reserva.imagem_restaurante}`}
                      alt={reserva.restaurante}
                    />
                    <ReservaDetails>
                      <NomeRestaurante>{reserva.restaurante}</NomeRestaurante>
                      <ReservaInfo>
                        {reserva.dia_semana} - {reserva.hora_inicio} a {reserva.hora_fim}
                      </ReservaInfo>
                      <ReservaInfo>Localização: {reserva.localizacao}</ReservaInfo>
                      <ReservaInfo>
                        Menus: {reserva.menus?.map((menu) => menu.nome_prato).join(', ') || 'N/A'}
                      </ReservaInfo>
                      <ReservaInfo>Preço Total: €{precoTotal.toFixed(2)}</ReservaInfo>
                      <ReservaInfo>Número de pessoas: {reserva.num_pessoas}</ReservaInfo>
                      <ReservaInfo>Data da reserva: {reserva.data_reserva_marcada}</ReservaInfo>
                      <ReservaInfo style={{ color: 'red' }}>Cancelada</ReservaInfo>
                    </ReservaDetails>
                  </ReservaCard>
                );
              })}
            </ReservasList>
          ) : (
            <p>Você não tem reservas canceladas.</p>
          )}
        </>
      )}

      {activeTab === 'passadas' && (
        <>

          {reservasPassadas.length > 0 ? (
            <ReservasList>
              {reservasPassadas.map((reserva) => {
                const precoTotal = calcularPrecoTotal(reserva.menus);
                return (
                  <ReservaCard key={reserva.id_reserva}>
                    <RestauranteImage
                      src={`data:image/jpeg;base64,${reserva.imagem_restaurante}`}
                      alt={reserva.restaurante}
                    />
                    <ReservaDetails>
                      <NomeRestaurante>{reserva.restaurante}</NomeRestaurante>
                      <ReservaInfo>
                        {reserva.dia_semana} - {reserva.hora_inicio} a {reserva.hora_fim}
                      </ReservaInfo>
                      <ReservaInfo>Localização: {reserva.localizacao}</ReservaInfo>
                      <ReservaInfo>
                        Menus: {reserva.menus?.map((menu) => menu.nome_prato).join(', ') || 'N/A'}
                      </ReservaInfo>
                      <ReservaInfo>Preço Total: €{precoTotal.toFixed(2)}</ReservaInfo>
                      <ReservaInfo>Número de pessoas: {reserva.num_pessoas}</ReservaInfo>
                      <ReservaInfo>Data da reserva: {reserva.data_reserva_marcada}</ReservaInfo>
                    </ReservaDetails>
                  </ReservaCard>
                );
              })}
            </ReservasList>
          ) : (
            <p>Você não tem reservas canceladas.</p>
          )}
        </>
      )}


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


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

export default MinhasReservas;
