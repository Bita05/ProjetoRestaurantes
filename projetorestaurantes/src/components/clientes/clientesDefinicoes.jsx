import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaSignOutAlt, FaUser, FaArrowLeft, FaCog } from 'react-icons/fa';
import { Container, Header, Banner, Button, LogoutButton, UserSection, ButtonVoltar, SettingsButton } from '../../styles/HomeStyled';
import {ModalSair, ModalSairContent, ModalTitle, ModalButtons, CancelButton, ConfirmButton} from '../../styles/PopUpSair';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const confirmLogout = () => setShowLogoutModal(true);
    const LogoutCancelled = () => setShowLogoutModal(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
            setFormData({
                nome: loggedUser.nome,
                email: loggedUser.email,
                telefone: loggedUser.telefone,
                password: '',
                confirmPassword: '',
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpdate = () => {
        if (formData.password !== formData.confirmPassword) {
            //alert('As passwords não coincidem!');
            showMessage('As passwords não coincidem!', 'error');
            return;
        }

        const dataToSend = {
            id: user.id,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,

        };

        if (formData.password) {
            dataToSend.password = formData.password;
        }

        fetch('http://localhost:8080/editarCliente', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    //alert('Dados atualizados com sucesso!');
                    showMessage('Dados atualizados com sucesso!', 'success');
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        nome: formData.nome,
                        email: formData.email,
                        telefone: formData.telefone
                    }));
                    //navigate('/');
                } else {

                    //alert('Erro ao atualizar: ' + (data.error || 'Tente novamente.'));
                    showMessage('Erro ao atualizar: ' + (data.error || 'Tente novamente.', 'error'));
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar:', error);
                alert('Erro ao atualizar os dados!');
            });
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


            <Banner>
                Definiçoes
            </Banner>

            <ButtonVoltar onClick={() => navigate('/clientes/home')}>
                <FaArrowLeft size={18} />
                Voltar
            </ButtonVoltar>




            <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
                    />
                </div>

                <div>
                    <label>Telefone:</label>
                    <input
                        type="text"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
                    />
                </div>

                <div>
                    <label>Nova Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
                    />
                </div>

                <div>
                    <label>Confirmar Nova Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
                    />
                </div>

                <Button onClick={handleUpdate} style={{ width: '100%' }}>
                    Atualizar Dados
                </Button>
            </div>


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

export default Settings;
