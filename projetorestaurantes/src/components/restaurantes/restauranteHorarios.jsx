import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, SidebarSeparator, Content, DashboardTitle, FormWrapper, FormTitle, Form, Input, Button, Label, Table, Footer, ResponsiveGrid, FormRow, Subtitle, IconButton } from '../../styles/restauranteStyle';
import { ModalSair, ModalSairContent, ModalTitle, ModalButtons, CancelButton, ConfirmButton } from '../../styles/PopUpSair';
import { FaTachometerAlt, FaPlus, FaSignOutAlt, FaRegClock, FaCalendarAlt, FaUser, FaEdit, FaTrash } from 'react-icons/fa';

const RestauranteAddHorario = () => {
    const [diaSemana, setDiaSemana] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');
    const [capacidadeMaxima, setCapacidadeMaxima] = useState('');
    const [horarios, setHorarios] = useState([]);
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const confirmLogout = () => setShowLogoutModal(true);
    const LogoutCancelled = () => setShowLogoutModal(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const loggedUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {


        //console.log("Usuário logado no localStorage:", loggedUser);

        if (!loggedUser || loggedUser.tipo !== 'restaurante') {
            navigate('/login');
            return null;
        }


        fetchHorarios(loggedUser.id_restaurante);
    }, [navigate]);

    const fetchHorarios = async (idRestaurante) => {

        try {
            const response = await fetch('http://localhost:8080/horarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_restaurante: idRestaurante }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setHorarios(data.horarios);
            } else {
                console.error('Erro ao procurar os horários:', data.error);
            }
        } catch (error) {
            console.error('Erro ao procurar os horários:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!diaSemana || !horaInicio || !horaFim || !capacidadeMaxima) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (Number(capacidadeMaxima) <= 0) {
            alert('Capacidade máxima deve ser maior que zero.');
            return;
        }

        const loggedUser = JSON.parse(localStorage.getItem('user'));
        const idRestaurante = loggedUser.id_restaurante;

        try {
            const response = await fetch('http://localhost:8080/horarios/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_restaurante: idRestaurante,
                    dia_semana: diaSemana,
                    hora_inicio: horaInicio,
                    hora_fim: horaFim,
                    capacidade_maxima: capacidadeMaxima
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                //alert('Horário adicionado com sucesso!');
                showMessage("Horário adicionado com sucesso!", 'success');
                fetchHorarios(idRestaurante); // Recarregar os horários
            } else {
                //alert('Erro ao adicionar horário: ' + data.error);
                showMessage("Erro ao adicionar horário", 'error');
            }
        } catch (error) {
            console.error('Erro ao adicionar horário:', error);
            //alert('Erro ao adicionar horário. Tente novamente.');
            showMessage("Erro ao adicionar horário. Tente novamente.", 'error');
        }
    };

    const handleEdit = () => {
        alert("Editar");

    }

    const handleDelete = async (id_horario) => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        const idRestaurante = loggedUser.id_restaurante;

        if (window.confirm("Tem certeza que deseja remover este horário?")) {
            try {
                const response = await fetch('http://localhost:8080/removerHorarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_restaurante: idRestaurante,
                        id_horario: id_horario
                    }),
                });
                console.log(diaSemana)
                const data = await response.json();

                if (data.status === 'success') {
                    //alert('Horário removido com sucesso!');
                    showMessage("Horário Removido com sucesso", 'success');
                    fetchHorarios(idRestaurante);
                } else {
                    showMessage("Não foi possivel remover o horário!", 'error');
                    //alert('Erro ao remover horário: ' + data.error);
                }
            } catch (error) {
                console.error('Erro ao remover horário:', error);
                // alert('Erro ao remover horário. Tente novamente.');
                showMessage("Erro ao remover horário. Tente novamente", 'error');
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

    const LogoutConfirm = () => {
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
                    <SidebarLink onClick={confirmLogout}><FaSignOutAlt /> Sair</SidebarLink>
                </SidebarMenu>
            </Sidebar>

            <Content>
                <DashboardTitle>Adicionar Novo Horário</DashboardTitle>

                <ResponsiveGrid>
                    <FormWrapper>
                        <FormTitle>Informações do Horário</FormTitle>
                        <Form onSubmit={handleSubmit}>
                            <Label>Dia da Semana</Label>
                            <select
                                value={diaSemana}
                                onChange={(e) => setDiaSemana(e.target.value)}
                                required
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            >
                                <option value="">Selecione o dia</option>
                                <option value="Segunda">Segunda-feira</option>
                                <option value="Terça">Terça-feira</option>
                                <option value="Quarta">Quarta-feira</option>
                                <option value="Quinta">Quinta-feira</option>
                                <option value="Sexta">Sexta-feira</option>
                                <option value="Sábado">Sábado</option>
                                <option value="Domingo">Domingo</option>
                            </select>

                            <FormRow>
                                <div>
                                    <Label>Hora Início</Label>
                                    <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
                                </div>
                                <div>
                                    <Label>Hora Fim</Label>
                                    <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
                                </div>
                            </FormRow>

                            <Label>Capacidade Máxima</Label>
                            <Input
                                type="number"
                                value={capacidadeMaxima}
                                onChange={(e) => setCapacidadeMaxima(e.target.value)}
                                required
                            />

                            <Button type="submit">Adicionar Horário</Button>
                        </Form>
                    </FormWrapper>

                    <div>
                        <Subtitle>Horários Registados</Subtitle>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Dia da Semana</th>
                                    <th>Hora Início</th>
                                    <th>Hora Fim</th>
                                    <th>Capacidade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {horarios.length > 0 ? (
                                    horarios.map((horario, index) => (
                                        <tr key={index}>
                                            <td>{horario.dia_semana}</td>
                                            <td>{horario.hora_inicio}</td>
                                            <td>{horario.hora_fim}</td>
                                            <td>{horario.capacidade_maxima}</td>
                                            <td>

                                                <IconButton onClick={() => handleDelete(horario.id_horario)}>
                                                    <FaTrash />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                            Nenhum horário cadastrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </ResponsiveGrid>
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

export default RestauranteAddHorario;
