import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, Content, DashboardTitle, InfoBox, SidebarSeparator, PedidosWrapper, PedidosTable, PedidosLinkDocumento, PedidosButton, PedidosActions, Footer } from '../../styles/HomeRestauranteStyled';
import { ModalSair, ModalSairContent, ModalTitle, ModalButtons, CancelButton, ConfirmButton } from '../../styles/PopUpSair';
import { FaTachometerAlt, FaSignOutAlt, FaUser, FaClipboardCheck } from 'react-icons/fa';

const AdminPedidosDeRegisto = () => {
    const [user, setUser] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const confirmLogout = () => setShowLogoutModal(true);
    const LogoutCancelled = () => setShowLogoutModal(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const navigate = useNavigate();

    const baseURL = "http://localhost:8080"; // substitui pelo domínio ou IP do teu servidor

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) {
            navigate('/login');
        } else {
            setUser(loggedUser);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/ObterPedidoRegisto');
                const data = await response.json();

                if (response.ok) {
                    setPedidos(data.pedidos);
                } else {
                    setError(data.message || 'Erro ao carregar os pedidos.');
                }
            } catch (err) {
                setError('Erro de conexão ao servidor.');
            }
        };

        fetchPedidos();
    }, []);

    const handleAprovar = async (id) => {
        try {
            const response = await fetch('http://localhost:8080/admin/AprovarPedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_pedidoregisto: id }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                //alert('Pedido aprovado com sucesso!');
                showMessage('Pedido aprovado com sucesso!', 'success');
                setPedidos(pedidos.map(pedido =>
                    pedido.id_pedidoregisto === id ? { ...pedido, status: 'aprovado' } : pedido
                ));
            } else {
                //alert(data.error || 'Erro ao aprovar pedido.');
                showMessage(data.error || 'Erro ao aprovar pedido.', 'error');
            }
        } catch (error) {
            //alert('Erro ao conectar ao servidor.');
            showMessage('Erro ao conectar ao servidor', 'error');
        }
    };

    const handleRejeitar = async (id) => {
        try {
            const response = await fetch('http://localhost:8080/admin/RejeitarPedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_pedidoregisto: id }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                //alert('Pedido Rejeitado com sucesso!');
                showMessage('Pedido rejeitado com sucesso!', 'success');
                setPedidos(pedidos.map(pedido =>
                    pedido.id_pedidoregisto === id ? { ...pedido, status: 'rejeitado' } : pedido
                ));
            } else {
                //alert(data.error || 'Erro ao rejeitar pedido.');
                showMessage(data.error || 'Erro ao rejeitar pedido.', 'error');
            }
        } catch (error) {
            //alert('Erro ao conectar ao servidor.');
            showMessage('Erro ao conectar ao servidor', 'error');
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

                    <InfoBox>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {pedidos.filter(pedido => pedido.status !== 'aprovado' && pedido.status !== 'rejeitado').length > 0 ? (
                            <PedidosWrapper>
                                <PedidosTable>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th>Documentos</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos
                                            .filter(pedido => pedido.status !== 'aprovado' && pedido.status !== 'rejeitado')
                                            .map((pedido) => (
                                                <tr key={pedido.id_pedidoregisto}>
                                                    <td>{pedido.id_pedidoregisto}</td>
                                                    <td>{pedido.nome_pedido}</td>
                                                    <td>{pedido.email_pedido}</td>
                                                    <td>{pedido.telefone_pedido}</td>
                                                    <td>
                                                        {pedido.comprovativo_morada ? (
                                                            <a
                                                                href={`${baseURL}/uploads/${pedido.comprovativo_morada}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Ver documento
                                                            </a>
                                                        ) : (
                                                            'Sem comprovativo'
                                                        )}
                                                    </td>
                                                    <td>
                                                        <PedidosActions>
                                                            <PedidosButton onClick={() => handleAprovar(pedido.id_pedidoregisto)}>Aprovar</PedidosButton>
                                                            <PedidosButton variant="danger" onClick={() => handleRejeitar(pedido.id_pedidoregisto)}>Rejeitar</PedidosButton>
                                                        </PedidosActions>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </PedidosTable>
                            </PedidosWrapper>

                        ) : (
                            <p>Não há pedidos de registo disponíveis.</p>
                        )}
                    </InfoBox>
                </div>
            </Content>
            <Footer>&copy; 2025 Administrador - Todos os direitos reservados</Footer>

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


export default AdminPedidosDeRegisto;
