import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, Content, DashboardTitle, InfoBox, Footer, SidebarSeparator, CardNumReservas, ReservasContent, ReservasNumber, ReservasText,
    CapacidadeCard, DiaSemanaTitle, HorarioCard, HorarioText, HorarioLabel, CapacidadeContainer, RestauranteInfoHeader, RestauranteName, StatusText, RestauranteDetails, RestauranteDescription, RestauranteLocation, RestauranteSchedule, StatusBadge
} from '../../styles/HomeRestauranteStyled';
import {ModalSair, ModalSairContent, ModalTitle, ModalButtons, CancelButton, ConfirmButton} from '../../styles/PopUpSair';
import { FaTachometerAlt, FaPlus, FaSignOutAlt, FaRegClock, FaCalendarAlt, FaUser, FaChartLine } from 'react-icons/fa';

const HomeRestaurante = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [reservations, setReservations] = useState(0);
    const [capacidade, setCapacidade] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const confirmLogout = () => setShowLogoutModal(true);
    const LogoutCancelled = () => setShowLogoutModal(false);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));

        if (!loggedUser || loggedUser.tipo !== 'restaurante') {
            navigate('/login');
        } else {
            fetchRestaurantInfo(loggedUser.id);
        }
    }, [navigate]);

    useEffect(() => {
        if (restaurant && restaurant.id_restaurante) {
            fetchNumeroReservas(restaurant.id_restaurante);
            fetchCapacidadeComOcupacao(restaurant.id_restaurante);
        }
    }, [restaurant]);

    const fetchRestaurantInfo = async (userId) => {
        try {
            const response = await fetch('http://localhost:8080/restaurante/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_utilizador: userId }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setRestaurant(data.restaurante);

                // Atualiza localStorage com id_restaurante
                const existingUser = JSON.parse(localStorage.getItem('user')) || {};
                const updatedUser = {
                    ...existingUser,
                    id_restaurante: data.restaurante.id_restaurante,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                console.error('Erro ao procurar restaurante:', data.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const fetchNumeroReservas = async (idRestaurante) => {
        try {
            const response = await fetch('http://localhost:8080/restaurante/ObterNumeroReservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: idRestaurante }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setReservations(data.numero_reservas);
            } else {
                console.error('Erro ao obter número de reservas:', data.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const fetchCapacidadeComOcupacao = async (idRestaurante) => {
        try {
            const response = await fetch('http://localhost:8080/ObterCapacidadeHorarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: idRestaurante }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setCapacidade(data.horarios);
            } else {
                console.error('Erro ao obter capacidade:', data.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const isRestaurantOpen = () => {
        if (!restaurant || !restaurant.horario) return false;

        const horario = restaurant.horario.split('-');
        const [horaInicio, horaFim] = horario.map(h => h.replace('h', '').padStart(2, '0') + ':00');

        const now = new Date();
        const startTime = new Date();
        const endTime = new Date();

        const [startHour, startMinute] = horaInicio.split(':').map(Number);
        const [endHour, endMinute] = horaFim.split(':').map(Number);

        startTime.setHours(startHour, startMinute, 0, 0);
        endTime.setHours(endHour, endMinute, 0, 0);

        return now >= startTime && now <= endTime;
    };

 

    const LogoutConfirm = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleMinhaConta = () => navigate('/restaurantes/restauranteMinhaConta');
    const handleMenu = () => navigate('/restaurantes/restauranteMenus');
    const handleHorarios = () => navigate('/restaurantes/restauranteHorarios');
    const handleReservas = () => navigate('/restaurantes/restauranteReservas');
    const handleDashboard = () => navigate('/restaurantes/home-restaurante');

    const groupByDiaSemana = (horarios) => {
        return horarios.reduce((acc, horario) => {
            const diaSemana = horario.dia_semana;
            if (!acc[diaSemana]) acc[diaSemana] = [];
            acc[diaSemana].push(horario);
            return acc;
        }, {});
    };

    const groupedCapacidade = groupByDiaSemana(capacidade);

    return (
        <Container>
            <Sidebar>
                <SidebarBrand>{restaurant?.nome || 'Admin Panel'}</SidebarBrand>
                <SidebarMenu>
                    <SidebarLink onClick={handleDashboard}><FaTachometerAlt /> Dashboard</SidebarLink>
                    <SidebarLink onClick={handleMenu}><FaPlus /> Menu</SidebarLink>
                    <SidebarLink onClick={handleHorarios}><FaRegClock /> Horários</SidebarLink>
                    <SidebarLink onClick={handleReservas}><FaCalendarAlt /> Reservas</SidebarLink>
                    <SidebarLink onClick={handleMinhaConta}><FaUser /> Minha Conta</SidebarLink>
                </SidebarMenu>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarLink onClick={confirmLogout}><FaSignOutAlt /> Sair</SidebarLink>
                </SidebarMenu>
            </Sidebar>

            <Content>
                <DashboardTitle>Painel de Administração</DashboardTitle>

                <InfoBox>
                    <RestauranteInfoHeader>
                        <RestauranteName>{restaurant ? restaurant.nome : 'Nome do Restaurante'}</RestauranteName>
                        <StatusBadge isOpen={isRestaurantOpen()}>
                            {isRestaurantOpen() ? 'Aberto' : 'Fechado'}
                        </StatusBadge>
                    </RestauranteInfoHeader>
                    <RestauranteDetails>
                        <RestauranteLocation>
                            {restaurant ? `Localização: ${restaurant.localizacao}, ${restaurant.cidade}, ${restaurant.pais}` : 'Carregando localização...'}
                        </RestauranteLocation>
                        <RestauranteSchedule>
                            {restaurant ? `Horário de funcionamento: ${restaurant.horario}` : 'Carregando horário...'}
                        </RestauranteSchedule>
                    </RestauranteDetails>
                </InfoBox>

                <div>
                    <h3>Capacidade e Ocupação</h3>
                    <CapacidadeContainer>
                        {Object.keys(groupedCapacidade).length > 0 ? (
                            Object.keys(groupedCapacidade).map((diaSemana) => (
                                <CapacidadeCard key={diaSemana}>
                                    <DiaSemanaTitle>{diaSemana}</DiaSemanaTitle>
                                    {groupedCapacidade[diaSemana].map((horario) => (
                                        <HorarioCard key={horario.id_horario}>
                                            <HorarioText><HorarioLabel>Hora:</HorarioLabel> {horario.hora_inicio} - {horario.hora_fim}</HorarioText>
                                            <HorarioText style={{ color: 'green' }}><HorarioLabel>Reservado:</HorarioLabel> {horario.total_reservado}</HorarioText>
                                            <HorarioText style={{ color: 'red' }}><HorarioLabel>Restante:</HorarioLabel> {horario.capacidade_restante}</HorarioText>
                                        </HorarioCard>
                                    ))}
                                </CapacidadeCard>
                            ))
                        ) : (
                            <p>Carregando capacidade...</p>
                        )}
                    </CapacidadeContainer>
                </div>

                <CardNumReservas>
                    <ReservasContent>
                        <FaChartLine size={40} color="#fff" />
                        <ReservasText>Reservas Semanais</ReservasText>
                        <ReservasNumber>{reservations}</ReservasNumber>
                    </ReservasContent>
                </CardNumReservas>
            </Content>

            <Footer>&copy; 2025 {restaurant?.nome || 'Restaurante'} - Todos os direitos reservados</Footer>




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

export default HomeRestaurante;
