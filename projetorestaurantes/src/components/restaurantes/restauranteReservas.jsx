import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, SidebarSeparator, Content, DashboardTitle, Footer, Card, MenuList, MenuItem, Modal, ModalContent, Button, MenuImage } from '../../styles/restauranteStyle'; 
import { FaTachometerAlt, FaPlus, FaSignOutAlt, FaRegClock, FaCalendarAlt, FaUser } from 'react-icons/fa';

const RestauranteReservas = () => {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [filtroDia, setFiltroDia] = useState('');
    const [reservaSelecionada, setReservaSelecionada] = useState(null); 


    const loggedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        

        if (!loggedUser || loggedUser.tipo !== 'restaurante') {
            navigate('/login'); 
            return null
        }

        const idRestaurante = loggedUser.id_restaurante;
        fetch('http://localhost:8080/restaurante/obterReservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_restaurante: idRestaurante })
        })
        .then(res => res.json())
        .then(data => {
          
            if (data.status === 'success') {
                console.log(data.reservas)
                setReservas(data.reservas);
            } else {
                setErro(data.error || 'Erro ao exibir reservas');
            }
        })
        .catch(err => {
            setErro('Erro ao conectar ao servidor.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    // Filtro das reservas com base no dia da semana
    const reservasFiltradas = filtroDia
        ? reservas.filter(reserva => reserva.dia_semana && reserva.dia_semana.trim() === filtroDia.trim())
        : reservas;

    // Função para calcular o preço total de uma reserva
    const calcularPrecoTotal = (menus) => {
        return menus.reduce((total, menu) => total + parseFloat(menu.preco), 0).toFixed(2);
    };

    const Logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleMenu = () => {
        navigate('/restaurantes/restauranteMenus');
    };

    const handleHorarios = () => {
        navigate('/restaurantes/restauranteHorarios');
    };

    const handleReservas = () => {
        navigate('/restaurantes/restauranteReservas');
    };

    const handleMinhaConta = () => {
        navigate('/restaurantes/restauranteMinhaConta');
    };

    const handleDashboard = () => {
        navigate('/restaurantes/home-restaurante');
    };

    return (
        <Container>
            <Sidebar>
                <SidebarBrand>{loggedUser?.nome || 'Admin Panel'}</SidebarBrand>
                <SidebarMenu>
                    <SidebarLink onClick={handleDashboard}><FaTachometerAlt /> Dashboard</SidebarLink>
                    <SidebarLink onClick={handleMenu}><FaPlus /> Menu</SidebarLink>
                    <SidebarLink onClick={handleHorarios}><FaRegClock /> Horários</SidebarLink>
                    <SidebarLink onClick={handleReservas}><FaCalendarAlt /> Reservas</SidebarLink>
                    <SidebarLink onClick={handleMinhaConta}><FaUser /> Minha Conta</SidebarLink>
                </SidebarMenu>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarLink onClick={Logout}><FaSignOutAlt /> Logout</SidebarLink>
                </SidebarMenu>
            </Sidebar>

            <Content>
                <DashboardTitle>Reservas</DashboardTitle>

                {/* Filtro por dia da semana */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="filtroDia" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filtrar por dia:</label>
                    <select
                        id="filtroDia"
                        value={filtroDia}
                        onChange={(e) => setFiltroDia(e.target.value)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
                    >
                        <option value="">Todos</option>
                        <option value="Segunda">Segunda-feira</option>
                        <option value="Terça">Terça-feira</option>
                        <option value="Quarta">Quarta-feira</option>
                        <option value="Quinta">Quinta-feira</option>
                        <option value="Sexta">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                    </select>
                </div>

                {/* Lista de reservas */}
                {loading ? (
                    <p>Carregando reservas...</p>
                ) : erro ? (
                    <p style={{ color: 'red' }}>{erro}</p>
                ) : reservasFiltradas.length === 0 ? (
                    <p>Nenhuma reserva encontrada.</p>
                ) : (
                    reservasFiltradas.map((reserva, index) => (
                        <Card key={index}>
                            <h3>📅 {reserva.data_reserva_marcada} ({reserva.dia_semana})</h3>
                            <p><strong>Cliente:</strong> {reserva.nome_cliente}</p>
                            <p><strong>Telefone:</strong> {reserva.telefone}</p>
                            <p><strong>Horário:</strong> {reserva.hora_inicio} - {reserva.hora_fim}</p>
                            <p><strong>Pessoas:</strong> {reserva.num_pessoas}</p>
                            <p><strong>Preço Total:</strong> {calcularPrecoTotal(reserva.menus)} €</p> {/* Exibe o preço total */}
                            <Button onClick={() => setReservaSelecionada(reserva)}>Ver detalhes</Button>
                        </Card>
                    ))
                )}

                {/* Modal com detalhes */}
                {reservaSelecionada && (
                    <Modal onClick={() => setReservaSelecionada(null)}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <h3>🍽️ Menus desta reserva</h3>
                            <MenuList>
                                {reservaSelecionada.menus.map((menu, idx) => (
                                    <MenuItem key={idx}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {menu.imagem && (
                                                <MenuImage
                                                    src={`data:image/jpeg;base64,${menu.imagem}`} // Exibindo imagem se existir
                                                    alt={menu.nome_prato}
                                                />
                                            )}
                                            <div>
                                                <p>{menu.nome_prato} - {parseFloat(menu.preco).toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    </MenuItem>
                                ))}
                            </MenuList>
                            <Button onClick={() => setReservaSelecionada(null)}>Fechar</Button>
                        </ModalContent>
                    </Modal>
                )}
            </Content>

            <Footer>&copy; 2025 {loggedUser?.nome || 'Restaurante'} - Todos os direitos reservados</Footer>
        </Container>
    );
};

export default RestauranteReservas;
