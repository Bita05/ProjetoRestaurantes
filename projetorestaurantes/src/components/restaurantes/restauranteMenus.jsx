import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, Content, SidebarSeparator, Footer } from '../../styles/HomeRestauranteStyled';
import { MenuContainer, MenuTitle, MenuGrid, MenuCard, AddMenuButton, ActionButton } from '../../styles/RestauranteMenuStyled';
import { FaTachometerAlt, FaPlus, FaSignOutAlt, FaEdit, FaTrashAlt, FaRegClock, FaCalendarAlt, FaUser } from 'react-icons/fa';

const RestauranteMenus = () => {
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const loggedUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        const fetchMenus = async () => {
            const idRestaurante = loggedUser?.id_restaurante;

            if (!loggedUser || loggedUser.tipo !== 'restaurante') {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/restaurante/listarMenu", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id_restaurante: loggedUser.id_restaurante }),
                });

                const data = await response.json();

                if (data.status === "success") {
                    setMenus(data.pratos);
                } else {
                    console.error("Erro ao procurar menus:", data.error);
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        };

        fetchMenus();
    }, [loggedUser, navigate]);

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


    const handleEdit = (menu) => {
        navigate('/restaurantes/restaurante-addMenu', { state: { menu } });
    };

    const handleDelete = async (idMenu) => {
        console.log("ID do menu a ser excluído:", idMenu);
        const ConfDelete = window.confirm("Tem certeza de que deseja remover o menu?");

        if (ConfDelete) {
            try {

                const response = await fetch("http://localhost:8080/menu/delete", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_menu: idMenu }),
                });

                const data = await response.json();

                if (data.status === "success") {

                    setMenus(menus.filter((menu) => menu.id_menu !== idMenu));
                    //alert("Menu removido com sucesso!");
                    showMessage("Menu removido com sucesso!", 'success');
                } else {
                    //alert("Erro ao remover o menu: " + data.error);
                    showMessage("Erro ao remover o menu: " + data.error, 'error');
                }
            } catch (error) {
                console.error("Erro ao remover o menu:", error);
                //alert("Erro ao remover o menu. Tente novamente.");
                showMessage("Erro ao remover o menu. Tente novamente.", 'error');
            }
        }
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
            <Sidebar>
                <SidebarBrand>{loggedUser?.nome || 'Admin Panel'}</SidebarBrand>
                <SidebarMenu>
                    <SidebarLink onClick={handleDashboard}>
                        <FaTachometerAlt /> Dashboard
                    </SidebarLink>
                    <SidebarLink onClick={handleMenu}>
                        <FaPlus /> Menu
                    </SidebarLink>
                    <SidebarLink onClick={handleHorarios}>
                        <FaRegClock /> Horários
                    </SidebarLink>
                    <SidebarLink onClick={handleReservas}>
                        <FaCalendarAlt /> Reservas
                    </SidebarLink>
                    <SidebarLink onClick={handleMinhaConta}>
                        <FaUser /> Minha Conta
                    </SidebarLink>
                </SidebarMenu>

                <SidebarSeparator />

                <SidebarMenu>
                    <SidebarLink onClick={Logout}>
                        <FaSignOutAlt /> Logout
                    </SidebarLink>
                </SidebarMenu>
            </Sidebar>

            <Content>
                <MenuContainer>
                    <MenuTitle>📋 Menu</MenuTitle>


                    <AddMenuButton onClick={() => navigate('/restaurantes/restaurante-addMenu')}>
                        <FaPlus /> Adicionar Novo Menu
                    </AddMenuButton>


                    <MenuGrid>
                        {menus.length > 0 ? (
                            menus.map((menu) => (
                                <MenuCard key={menu.id_menu}>
                                    <img
                                        src={`data:image/jpeg;base64,${menu.imagem}`}
                                        alt={menu.nome_prato}
                                    />
                                    <div className="details">
                                        <h3>{menu.nome_prato}</h3>
                                        <p>{menu.descricao}</p>
                                        <strong>Preço: €{menu.preco}</strong>
                                    </div>


                                    <div className="actions">
                                        <ActionButton onClick={() => handleEdit(menu)} title="Editar">
                                            <FaEdit />
                                        </ActionButton>
                                        <ActionButton onClick={() => handleDelete(menu.id_menu)} title="Excluir">
                                            <FaTrashAlt />
                                        </ActionButton>
                                    </div>
                                </MenuCard>
                            ))
                        ) : (
                            <p> Nenhum prato adicionado</p>
                        )}
                    </MenuGrid>
                </MenuContainer>
            </Content>
            <Footer>&copy; 2025 {loggedUser?.nome || 'Restaurante'} - Todos os direitos reservados</Footer>

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
        </Container>
    );
};

export default RestauranteMenus;
