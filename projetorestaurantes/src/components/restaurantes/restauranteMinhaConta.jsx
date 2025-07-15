import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaSignOutAlt, FaRegClock, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Container, Sidebar, SidebarBrand, SidebarMenu, SidebarLink, SidebarSeparator, Content, DashboardTitle, FormWrapperConta, FormTitleConta, FormConta, InputGroup, Input, Button, Label, Footer, Subtitle, 
    InfoPessoalWrapper, ReadOnlyInput, ImagePreview
  } from '../../styles/restauranteStyle'; 

const RestauranteMinhaConta = () => {
    const [restauranteData, setRestauranteData] = useState({
       nomeRestaurante: '',
    imagem: '',
    descricao: '',
    localizacao: '',
    cidade: '',
    pais: '',
    horario: '',
    id_utilizador: '',
    nomeUtilizador: '',
    email: '',
    telefone: '',
    password: '',
    confirmarPassword: ''
    });

    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser || loggedUser.tipo !== 'restaurante') {
            navigate('/login');
        } else {
            fetchRestauranteInfo(loggedUser.id_restaurante);
        }
    }, [navigate]);

    const fetchRestauranteInfo = async (idRestaurante) => {
        try {
            const response = await fetch('http://localhost:8080/restaurante/DadosRestaurante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: idRestaurante })
            });
            const data = await response.json();
            if (data.status === 'success') {
                console.log(data)
                setRestauranteData(prev => ({
                    ...prev,
                    nomeRestaurante: data.restaurante.nome,
                    imagem: data.restaurante.imagem || '',
                    descricao: data.restaurante.descricao,
                    localizacao: data.restaurante.localizacao,
                    cidade: data.restaurante.cidade,
                    pais: data.restaurante.pais,
                    horario: data.restaurante.horario,
                    id_utilizador: data.utilizador.id,
                    nomeUtilizador: data.utilizador.nome,
                    email: data.utilizador.email,
                    telefone: data.utilizador.telefone
                }));
            } else {
                console.error('Erro:', data.error);
            }
        } catch (error) {
            console.error('Erro ao buscar restaurante:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setRestauranteData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRestauranteData(prev => ({
                ...prev,
                imagem: file
            }));
        }
    };


     const ValidarTelemovel = (telefone) => {
        const regex = /^((9[1236])|(2\d)|(800)|(808)|(707))\d{7}$/;
        return regex.test(telefone);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (restauranteData.password && restauranteData.password !== restauranteData.confirmarPassword) {
        alert('As passwords não coincidem.');
        return;
    }


    const horarioValido = /^\d{1,2}h-\d{1,2}h$/.test(restauranteData.horario);
    if (!horarioValido) {
    alert('Por favor, insira o horário no formato correto, exemplo: 9h-23h');
    return;
  }


    if (!ValidarTelemovel(restauranteData.telefone)) {
        alert('Deve indicar um numero de telefone válido!');
        return;
    }   


  
    const formData = new FormData();
    

    if (restauranteData.imagem instanceof File) {
    // Se selecionou uma nova imagem, envia ela
    formData.append('imagem', restauranteData.imagem);
  } else {
    // Senão, converte a imagem atual (string base64 ou URL) para blob e envia
    const response = await fetch(restauranteData.imagem);
    const blob = await response.blob();
    const file = new File([blob], 'imagem_atual.jpg', { type: blob.type });
    formData.append('imagem', file);
  }

    formData.append('id_utilizador', restauranteData.id_utilizador || loggedUser.id);
    formData.append('telefone', restauranteData.telefone || '');
    formData.append('password', restauranteData.password || '');
    formData.append('nome', restauranteData.nomeRestaurante || '');
    formData.append('descricao', restauranteData.descricao || '');
    formData.append('localizacao', restauranteData.localizacao || '');
    formData.append('cidade', restauranteData.cidade || '');
    formData.append('horario', restauranteData.horario || '');  
    formData.append('pais', restauranteData.pais || '');
    try {
        const response = await fetch('http://localhost:8080/restaurante/AtualizarRestaurante', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data)
        if (data.status === 'success') {
            //alert('Informações atualizadas com sucesso!');
             showMessage('Informações atualizadas com sucesso!', 'success');
        } else {
            //alert('Erro ao atualizar: ' + data.error);
            showMessage('Erro ao atualizar', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('Erro' + error, 'error');
        //alert('Erro na atualização.');
    }
};

    const handleLogout = () => {
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

    if (loading) return <p>Carregando informações...</p>;

    return (
        <Container>
            <Sidebar>
                <SidebarBrand>{restauranteData?.nomeRestaurante || 'Admin Panel'}</SidebarBrand>
                <SidebarMenu>
                    <SidebarLink onClick={() => navigate('/restaurantes/home-restaurante')}>
                        <FaTachometerAlt /> Dashboard
                    </SidebarLink>
                    <SidebarLink onClick={() => navigate('/restaurantes/restauranteMenus')}>
                        <FaPlus /> Menu
                    </SidebarLink>
                    <SidebarLink onClick={() => navigate('/restaurantes/restauranteHorarios')}>
                        <FaRegClock /> Horários
                    </SidebarLink>
                    <SidebarLink onClick={() => navigate('/restaurantes/restauranteReservas')}>
                        <FaCalendarAlt /> Reservas
                    </SidebarLink>
                    <SidebarLink onClick={() => navigate('/restaurantes/restauranteMinhaConta')}>
                        <FaUser /> Minha Conta
                    </SidebarLink>
                </SidebarMenu>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarLink onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </SidebarLink>
                </SidebarMenu>
            </Sidebar>

            <Content>
                <FormWrapperConta>
                    <FormTitleConta>Atualize suas informações</FormTitleConta>
                    <FormConta onSubmit={handleSubmit}>

                        <InputGroup>
                            <Label>Nome do Restaurante</Label>
                            <Input name="nomeRestaurante" value={restauranteData.nomeRestaurante} onChange={handleChange} />
                        </InputGroup>

                        <InputGroup>
                            <Label>Imagem</Label>
                            <Input type="file" name="imagem" accept="image/*" onChange={handleImageChange} />
                            {restauranteData.imagem && (
                                <ImagePreview
                                    src={
                                        restauranteData.imagem instanceof File
                                        ? URL.createObjectURL(restauranteData.imagem)
                                        : restauranteData.imagem
                                    }
                                    alt="Preview"
                                />
                            )}
                        </InputGroup>

                        
                            <Label>Descrição</Label>
                            <Input name="descricao" value={restauranteData.descricao} onChange={handleChange} />
 
                        <InputGroup>
                            <Label>Localização</Label>
                            <Input name="localizacao" value={restauranteData.localizacao} onChange={handleChange} />
                        </InputGroup>

                        <InputGroup>
                            <Label>Cidade</Label>
                            <Input name="cidade" value={restauranteData.cidade} onChange={handleChange} />
                        </InputGroup>

                        <InputGroup>
                            <Label>País</Label>
                            <Input name="pais" value={restauranteData.pais} onChange={handleChange} />
                        </InputGroup>

                        <InputGroup>
                            <Label>Horário (ex: 9h-23h)</Label>
                            <Input
                                name="horario"
                                value={restauranteData.horario}
                                onChange={handleChange}
                                pattern="^\d{1,2}h-\d{1,2}h$"
                                title="Formato esperado: 9h-23h"
                                required
                            />
                        </InputGroup>

                        <Subtitle>Informações Pessoais</Subtitle>

                        <InfoPessoalWrapper>
                            <InputGroup>
                                <Label>Nome do Utilizador</Label>
                                <ReadOnlyInput name="nomeUtilizador" value={restauranteData.nomeUtilizador} readOnly />
                            </InputGroup>

                            <InputGroup>
                                <Label>Email</Label>
                                <ReadOnlyInput name="email" value={restauranteData.email} readOnly />
                            </InputGroup>

                            <InputGroup>
                                <Label>Telefone</Label>
                                <Input name="telefone" value={restauranteData.telefone} onChange={handleChange} />
                            </InputGroup>

                            <InputGroup>
                                <Label>Nova Password</Label>
                                <Input type="password" name="password" value={restauranteData.password} onChange={handleChange} />
                            </InputGroup>

                            <InputGroup>
                                <Label>Confirmar Password</Label>
                                <Input type="password" name="confirmarPassword" value={restauranteData.confirmarPassword} onChange={handleChange} />
                            </InputGroup>
                        </InfoPessoalWrapper>

                        <Button type="submit">Atualizar Conta</Button>
                    </FormConta>
                </FormWrapperConta>
            </Content>


            <Footer>&copy; 2025 {restauranteData?.nomeRestaurante || 'Restaurante'} - Todos os direitos reservados</Footer>



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

export default RestauranteMinhaConta;