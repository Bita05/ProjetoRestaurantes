import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, Content, DashboardTitle, InfoBox, SidebarSeparator, PedidosWrapper, PedidosTable, PedidosLinkDocumento, PedidosButton, PedidosActions, Footer } from '../../styles/HomeRestauranteStyled';
import { FaTachometerAlt, FaSignOutAlt, FaUser, FaClipboardCheck   } from 'react-icons/fa';

const AdminPedidosDeRegisto = () => {
    const [user, setUser] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const baseURL = "https://projetorestaurantes.onrender.com/"; // substitui pelo domínio ou IP do teu servidor

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
                const response = await fetch('https://projetorestaurantes.onrender.com/admin/ObterPedidoRegisto');
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
            const response = await fetch('https://projetorestaurantes.onrender.com/admin/AprovarPedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_pedidoregisto: id }),
            });
    
            const data = await response.json();
    
            if (data.status === 'success') {
                alert('Pedido aprovado com sucesso!');
                setPedidos(pedidos.map(pedido =>
                    pedido.id_pedidoregisto === id ? { ...pedido, status: 'aprovado' } : pedido
                ));
            } else {
                alert(data.error || 'Erro ao aprovar pedido.');
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor.');
        }
    };

    const handleRejeitar = async  (id) => {
        try {
            const response = await fetch('https://projetorestaurantes.onrender.com/admin/RejeitarPedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_pedidoregisto: id }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                alert('Pedido Rejeitado com sucesso!');
                setPedidos(pedidos.map(pedido =>
                    pedido.id_pedidoregisto === id ? { ...pedido, status: 'rejeitado' } : pedido
                ));
            } else {
                alert(data.error || 'Erro ao rejeitar pedido.');
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor.');
        }
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

    const Logout = () => {
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
                                <SidebarLink onClick={Logout}>
                                    <FaSignOutAlt /> Logout
                                </SidebarLink>
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
        </Container>
    );
};


export default AdminPedidosDeRegisto;
