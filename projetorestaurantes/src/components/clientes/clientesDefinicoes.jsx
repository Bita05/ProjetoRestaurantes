import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaSignOutAlt, FaUser, FaArrowLeft, FaCog } from 'react-icons/fa';
import { Container, Header, Banner, Button, LogoutButton, UserSection, ButtonVoltar, SettingsButton } from '../../styles/HomeStyled';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
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
            alert('As passwords não coincidem!');
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

        fetch('https://projetorestaurantes.onrender.com/editarCliente', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Dados atualizados com sucesso!');
                localStorage.setItem('user', JSON.stringify({
                    ...user,
                    nome: formData.nome,
                    email: formData.email,
                    telefone: formData.telefone
                }));
                navigate('/');
            } else {
                alert('Erro ao atualizar: ' + (data.error || 'Tente novamente.'));
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar os dados!');
        });
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
                                       <LogoutButton onClick={() => {
                                           localStorage.removeItem('user');
                                           setUser(null);
                                       }}>
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
        </Container>
    );
};

export default Settings;
