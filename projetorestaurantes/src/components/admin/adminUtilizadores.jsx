import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FaTachometerAlt, FaSignOutAlt, FaEdit, FaUser, FaClipboardCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ModalForm, ModalFormContent, CloseFormButton, ModalFormTitle, ModalFormInput, ModalFormButton, GeneratePasswordFormButton, ModalFormLabel } from '../../styles/PopUpFormStyled';
import { Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, Content, DashboardTitle, SidebarSeparator, TableUtilizadoresWrapper, TableUtilizadores, ErrorText, EditButton, Footer } from '../../styles/HomeRestauranteStyled';

const AdminUtilizadores = () => {
    const [utilizadores, setUtilizadores] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [imagem, setImagem] = useState(null);
    const [tipoSelecionado, setTipoSelecionado] = useState('restaurante'); // Controla o tipo (restaurante ou cliente)
    const [showPassword, setShowPassword] = useState(false);
    

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const navigate = useNavigate();
    

    // Função para fazer a requisição ao backend com base no tipo selecionado
    const fetchUtilizadores = async () => {
        try {
            const endpoint = tipoSelecionado === 'cliente'
                ? 'http://localhost:8080/admin/UtilizadoresClientes'
                : 'http://localhost:8080/admin/Utilizadores';

            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setUtilizadores(data.utilizadores);
            } else {
                setError(data.message || 'Erro ao carregar os utilizadores.');
            }
        } catch (err) {
            setError('Erro de conexão ao servidor.');
        }
    };

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) {
            navigate('/login');
        } else {
            fetchUtilizadores(); // Carrega os utilizadores quando o componente for montado
        }
    }, [navigate, tipoSelecionado]); // Recarrega quando o tipoSelecionado mudar

    const handleEdit = (utilizador) => {
        setSelectedUser(utilizador);
        setNewPassword('');
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedUser(null);
        setImagem(null); // Resetar a imagem
    };

    const handleSave = async () => {
    try {
        if (tipoSelecionado === 'restaurante') {

            const horarioRegex = /^\d{1,2}h-\d{1,2}h$/;
            if (!horarioRegex.test(selectedUser.horario)) {
                    showMessage('Formato de horário inválido. Use o formato Ex: 9h-23h', 'error');
                    return; 
                }

            const formData = new FormData();
            formData.append('id_restaurante', selectedUser.id_restaurante);
            formData.append('nome', selectedUser.nome_restaurante);
            formData.append('descricao', selectedUser.descricao || '');
            formData.append('localizacao', selectedUser.localizacao || '');
            formData.append('cidade', selectedUser.cidade || '');
            formData.append('pais', selectedUser.pais || '');
            formData.append('horario', selectedUser.horario || '');
            formData.append('password', newPassword);

            if (imagem) formData.append('imagem', imagem);

            const response = await fetch('http://localhost:8080/admin/EditarRestaurantes', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                //alert('Restaurante atualizado com sucesso!');
                showMessage('Restaurante atualizado com sucesso!' , 'success');
                fetchUtilizadores();
                handleCloseModal();
            } else {
                //setError(data.error || 'Erro ao atualizar o restaurante.');
                showMessage(data.error || 'Erro ao atualizar o restaurante.' , 'error');
            }

        } else if (tipoSelecionado === 'cliente') {


            if (!ValidarTelemovel(selectedUser.telefone)) {
                alert('Deve indicar um numero de telefone válido!');
                showMessage('D  eve indicar um numero de telefone válido.' , 'error');
                return;
            } 

            const formData = new FormData();
            formData.append('id', selectedUser.id);
            formData.append('nome', selectedUser.nome);
            formData.append('telefone', selectedUser.telefone);
            formData.append('email', selectedUser.email);
            formData.append('password', newPassword);

          

            const response = await fetch('http://localhost:8080/admin/AtualizarContaCliente', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                //alert('Cliente atualizado com sucesso!');
                showMessage('Cliente atualizado com sucesso!' , 'success');
                fetchUtilizadores();
                handleCloseModal();
            } else {
                //setError(data.error || 'Erro ao atualizar o cliente.');
                showMessage(data.error || 'Erro ao atualizar o cliente.' , 'error');
            }
        }
    } catch (error) {
        //setError('Erro ao conectar ao servidor ou ao atualizar o utilizador.');
        showMessage('Erro ao conectar ao servidor ou ao atualizar o utilizador.' , 'error');
    }
};

    // Função para gerar uma senha mais simples e comum
    const generatePassword = (length = 10) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };

 const ValidarTelemovel = (telefone) => {
        const regex = /^((9[1236])|(2\d)|(800)|(808)|(707))\d{7}$/;
        return regex.test(telefone);
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

    const handleGeneratePassword = () => {
        setNewPassword(generatePassword(10)); // Gera uma senha com 10 caracteres
    };

    const handleTipoChange = (tipo) => {
        setTipoSelecionado(tipo); // Atualiza o tipo selecionado (cliente ou restaurante)
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
                    <DashboardTitle>Utilizadores</DashboardTitle>

                    {/* Filtro clientes e restaurantes */}
                    <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        Tipo de utilizador:
                    </label>
                    <select
                        onChange={(e) => handleTipoChange(e.target.value)}
                        value={tipoSelecionado}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                        }}
                    >
                        <option value="restaurante">Restaurantes</option>
                        <option value="cliente">Clientes</option>
                    </select>
                </div>

                    <TableUtilizadoresWrapper>
                        {error && <ErrorText>{error}</ErrorText>}

                        {utilizadores && utilizadores.length > 0 ? (
                            <TableUtilizadores>
                            <thead>
                                <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {utilizadores.map((utilizador) => (
                                <tr key={utilizador.id_utilizador}>
                                    <td>{utilizador.nome_restaurante || utilizador.nome}</td>
                                    <td>{utilizador.email}</td>
                                    <td>{utilizador.telefone}</td>
                                    <td>
                                    <EditButton onClick={() => handleEdit(utilizador)} title="Editar">
                                        <FaEdit />
                                    </EditButton>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </TableUtilizadores>
                        ) : (
                            <p>Não há utilizadores disponíveis.</p>
                        )}
                        </TableUtilizadoresWrapper>
                </div>
            </Content>

            {modalIsOpen && (
                <ModalForm>
                    <ModalFormContent>
                        <CloseFormButton onClick={handleCloseModal}>X</CloseFormButton>
                        <ModalFormTitle>Editar Utilizador</ModalFormTitle>
                        {selectedUser && (
                            <div>
                                {/* Se for restaurante */}
                                {tipoSelecionado === 'restaurante' && (
                                    <>
                                        <ModalFormLabel>Nome do Restaurante:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.nome_restaurante || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, nome_restaurante: e.target.value })}
                                        />

                                        <ModalFormLabel>Descrição:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.descricao || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, descricao: e.target.value })}
                                        />

                                        <ModalFormLabel>Localização:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.localizacao || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, localizacao: e.target.value })}
                                        />

                                        <ModalFormLabel>Cidade:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.cidade || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, cidade: e.target.value })}
                                        />

                                        <ModalFormLabel>País:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.pais || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, pais: e.target.value })}
                                        />

                                        <ModalFormLabel>Horário:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.horario || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, horario: e.target.value })}
                                            pattern="^\d{1,2}h-\d{1,2}h$"
                                            title="Formato esperado: 9h-23h"
                                            required
                                        />

                                        
                                        <ModalFormLabel>Password:</ModalFormLabel>
                                       <div style={{ position: 'relative', width: '100%' }}>
                                        <ModalFormInput
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            style={{ paddingRight: '40px' }} // espaço para o botão
                                            readOnly 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                color: '#333',
                                            }}
                                            title={showPassword ? 'Esconder password' : 'Mostrar password'}
                                        >
                                            {showPassword ?  <FaEyeSlash /> : <FaEye/> }
                                        </button>
                                    </div>
                                        
                                        <GeneratePasswordFormButton type="button" onClick={handleGeneratePassword}>
                                            Gerar Password
                                        </GeneratePasswordFormButton>
                                    </>
                                )}

                                {/* Se for cliente */}
                                {tipoSelecionado === 'cliente' && (
                                    <>
                                        <ModalFormLabel>Nome:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.nome || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, nome: e.target.value })}
                                        />

                                        <ModalFormLabel>Email:</ModalFormLabel>
                                        <ModalFormInput
                                            type="email"
                                            value={selectedUser.email || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                            readOnly
                                        />

                                        <ModalFormLabel>Telefone:</ModalFormLabel>
                                        <ModalFormInput
                                            type="text"
                                            value={selectedUser.telefone || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, telefone: e.target.value })}
                                        />

                                        <ModalFormLabel>Password:</ModalFormLabel>
                                       <div style={{ position: 'relative', width: '100%' }}>
                                            <ModalFormInput
                                                type={showPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                readOnly
                                                style={{ paddingRight: '40px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    color: '#333',
                                                }}
                                                title={showPassword ? 'Esconder password' : 'Mostrar password'}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <GeneratePasswordFormButton type="button" onClick={handleGeneratePassword}>
                                            Gerar Password
                                        </GeneratePasswordFormButton>
                                    </>
                                )}

                              {tipoSelecionado === 'restaurante' && (
                                    <>
                                        <ModalFormLabel>Imagem:</ModalFormLabel>
                                        <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
                                    </>
                                )}

                                <ModalFormButton onClick={handleSave}>Guardar</ModalFormButton>
                                <ModalFormButton onClick={handleCloseModal}>Cancelar</ModalFormButton>
                            </div>
                        )}
                    </ModalFormContent>
                </ModalForm>
            )}
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
        </Container>
    );
};

export default AdminUtilizadores;
