import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { FaPlus, FaTimes  } from 'react-icons/fa';
import { Container, Header, Banner, RestaurantGrid, RestaurantCard, Button, LogoutButton, SettingsButton, UserSection, PopularSection, Footer } from '../../styles/HomeStyled';
import {
    Modal, ModalContent, CloseButton, StepButton, HorarioButton, MenuList, MenuCard, MenuImage, MenuDetails, MenuTitle, MenuDescription, MenuPrice, SelectMenuButton, NavigationContainer, NavigationArrow,
    ProgressBar, ProgressFill
} from '../../styles/PopUpStyled';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [numPessoas, setNumPessoas] = useState(1);
    const [menus, setMenus] = useState([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [selectedMenuNames, setSelectedMenuNames] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [selectedHorarioId, setSelectedHorarioId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showPopUpLogin, setShowPopUpLogin] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredHorarios, setFilteredHorarios] = useState([]);
    const [restaurantesPopulares, setRestaurantesPopulares] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');


    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
        }

        fetch('http://localhost:8080/restaurantes')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setRestaurants(data.restaurantes);
                } else {
                    console.error('Erro ao carregar restaurantes:', data.error);
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });


        fetch('http://localhost:8080/restaurante/RestaurantesPopulares')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log(data)
                    setRestaurantesPopulares(data.restaurantes);
                } else {
                    console.error('Erro ao carregar restaurantes populares:', data.message);
                }
            })
            .catch(error => {
                console.error('Erro na requisição de restaurantes populares:', error);
            });

    }, []);

    const openReservationModal = (restaurant) => {
        if (!user) {
            setShowPopUpLogin(true);
            return;
        }

        setSelectedRestaurant(restaurant);
        setShowModal(true);
        setCurrentStep(1);

        setSelectedDate('');
        setMenus([]);
        setHorarios([]);
        setFilteredHorarios([]);
        setSelectedMenuIds([]);
        setSelectedMenuNames([]);
        setSelectedHorarioId(null);
    };

    const handleNextStep = async () => {
        switch (currentStep) {
            case 1:
                if (!selectedDate) {
                    //alert("Selecione uma data para prosseguir.");
                    showMessage("Selecione uma data para prosseguir.", "warning");
                    return;
                }

                const existeReserva = await verificarReservaExistente();
                if (existeReserva) {
                    // alert("Já existe uma reserva sua para esta data.");
                    showMessage("Já existe uma reserva sua para esta data.", "warning");
                    return;
                }

                const horariosData = await fetch('http://localhost:8080/horariosReserva', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_restaurante: selectedRestaurant.id_restaurante,
                        data_reserva: selectedDate
                    })
                }).then(res => res.json());

                if (horariosData.status === 'success') {
                    setHorarios(horariosData.horarios);
                    filterHorariosByDate(selectedDate, horariosData.horarios);
                } else {
                    //alert('Erro ao carregar horários.');
                    showMessage('Erro ao carregar horários.', "error");
                    return;
                }

                setCurrentStep(2);
                break;

            case 2:
                if (!numPessoas || numPessoas <= 0) {
                    // alert("Digite o número de pessoas.");
                    showMessage("Digite o número de pessoas.", "warning");
                    return;
                }

                const menuData = await fetch('http://localhost:8080/restaurante/listarMenu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_restaurante: selectedRestaurant.id_restaurante })
                }).then(res => res.json());

                if (menuData.status === 'success') {
                    setMenus(menuData.pratos);
                } else {
                    showMessage("Erro ao carregar menus.", "error");
                    //alert('Erro ao carregar menus.');
                    return;
                }

                setCurrentStep(3);
                break;

            case 3:
                if (selectedMenuIds.length === 0) {
                    showMessage("Selecione pelo menos um menu.", "warning");
                    //alert("Selecione pelo menos um menu.");
                    return;
                }
                setCurrentStep(4);
                break;

            case 4:
                if (!selectedHorarioId) {
                    showMessage("Selecione um horário.", "warning");
                    //alert("Selecione um horário.");
                    return;
                }
                await handleReserve();
                break;

            default:
                break;
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReserve = () => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        const idCliente = loggedUser.id;
        const idRestaurante = selectedRestaurant.id_restaurante;

        if (selectedHorarioId && selectedMenuIds.length > 0 && numPessoas && idCliente && idRestaurante && selectedDate) {
            const reservaData = {
                id_restaurante: idRestaurante,
                id_horario: selectedHorarioId,
                id_cliente: idCliente,
                num_pessoas: numPessoas,
                id_menus: selectedMenuIds,
                data_reserva: selectedDate,
                data_reserva_marcada: selectedDate
            };

            console.log('Dados da Reserva:', reservaData);

            fetch('http://localhost:8080/addReservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setCurrentStep(5); // Passo de confirmação
                        showMessage('Reserva feita com sucesso!', 'success');
                    } else {
                        showMessage("Erro ao fazer reserva", "error");
                        //alert('Erro ao fazer a reserva!');
                        setCurrentStep(4);
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);
                    //alert('Erro ao fazer a reserva!');
                    showMessage('Erro ao fazer a reserva!', 'error');
                    setCurrentStep(4);
                });
        } else {
            showMessage("Por favor, preencha todos os campos corretamente.", "info");
            // alert('Por favor, preencha todos os campos corretamente.');
        }
    };

    // Função para mapear a data para o nome do dia da semana
    const getDayName = (date) => {
        const daysOfWeek = [
            'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
        ];
        const dayIndex = new Date(date).getDay(); // Retorna o índice do dia da semana (0 a 6)
        return daysOfWeek[dayIndex];
    };

    const filterHorariosByDate = (date, horariosList = horarios) => {
        const dayName = getDayName(date);
        const currentDate = new Date();


        const filtered = horariosList.filter(h => h.dia_semana.toLowerCase() === dayName.toLowerCase());


        const filteredWithAvailability = filtered.map(h => {
            const horarioDate = new Date(`${date} ${h.hora_inicio}`);
            const timeDifferenceInHours = (horarioDate - currentDate) / 1000 / 3600;

            const capacidadeRestante = h.capacidade_maxima - h.reservas_atuais;
            const isDisponivel = timeDifferenceInHours > 2 && capacidadeRestante > 0;

            return {
                ...h,
                isDisponivel,
                capacidadeRestante
            };
        });

        // Atualiza a lista de horários filtrados com a informação de disponibilidade
        setFilteredHorarios(filteredWithAvailability);
    };

    const handleInfoRestaurant = (restaurant) => {
        navigate(`/clientes/RestauranteInfo/${restaurant.id_restaurante}`, {
            state: { restaurante: restaurant }
        });
    };

    // Verificar Reserva Exisitente
    const verificarReservaExistente = async () => {
        const idCliente = user?.id;
        const idRestaurante = selectedRestaurant?.id_restaurante;

        try {
            const response = await fetch('http://localhost:8080/verificarReservasExistentes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_cliente: idCliente,
                    data_reserva_marcada: selectedDate,
                    id_restaurante: idRestaurante
                })
            });

            const data = await response.json();
            return data.reserva_existente;
        } catch (error) {
            console.error('Erro ao verificar reserva existente:', error);
            return false;
        }
    };

    const isRestaurantOpen = (horario) => {
        if (!horario) return false;

        const horarioParts = horario.split('-');
        if (horarioParts.length !== 2) return false;

        // Remove o 'h', formata para "HH:mm"
        const [horaInicio, horaFim] = horarioParts.map(h => h.replace('h', '').padStart(2, '0') + ':00');

        const now = new Date();
        const startTime = new Date();
        const endTime = new Date();

        const [startHour, startMinute] = horaInicio.split(':').map(Number);
        const [endHour, endMinute] = horaFim.split(':').map(Number);

        startTime.setHours(startHour, startMinute, 0, 0);
        endTime.setHours(endHour, endMinute, 0, 0);

        return now >= startTime && now <= endTime;
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
                            <Button onClick={() => navigate('/clientes/minhas-reservas')}>
                                Minhas Reservas
                            </Button>
                            <SettingsButton onClick={() => navigate('/clientes/clientesDefinicoes')}>
                                <FaCog />
                            </SettingsButton>
                            <LogoutButton onClick={() => {
                                localStorage.removeItem('user');
                                setUser(null);
                                navigate('/login')
                            }}>
                                <FaSignOutAlt />
                            </LogoutButton>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/register')}>
                                Registar
                            </Button>
                            <Button onClick={() => navigate('/login')}>
                                Iniciar Sessão
                            </Button>
                        </>
                    )}
                </div>
            </Header>

            {showPopUpLogin && (
                <Modal>
                    <ModalContent>
                        <CloseButton onClick={() => setShowPopUpLogin(false)}>X</CloseButton>
                        <h3>Não está com sessão iniciada</h3>
                        <p>Pretende iniciar sessão para fazer uma reserva?</p>
                        <Button onClick={() => {
                            navigate('/login');
                            setShowPopUpLogin(false);
                        }} style={{ width: '100%' }}>
                            Iniciar Sessão
                        </Button>
                    </ModalContent>
                </Modal>
            )}

            <Banner>
                Explore os melhores restaurantes perto de si!
            </Banner>

            <div style={{ padding: '1rem', textAlign: 'center' }}>
                <input
                    type="text"
                    placeholder="🔍 Procurar restaurante por nome ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '60%',
                        maxWidth: '500px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
            </div>

            <RestaurantGrid>
                {restaurants.length > 0 ? (
                    restaurants
                        .filter(restaurant =>
                            restaurant.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            restaurant.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((restaurant) => (
                            <RestaurantCard key={restaurant.id_restaurante}
                                onClick={() => handleInfoRestaurant(restaurant)}
                                style={{ cursor: 'pointer' }}>
                                <img
                                    src={`data:image/jpeg;base64,${restaurant.imagem}`}
                                    alt={restaurant.nome}
                                />

                                <div className="details">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h3 style={{ margin: 0 }}>{restaurant.nome}</h3>
                                        <span
                                            style={{
                                                backgroundColor: isRestaurantOpen(restaurant.horario) ? 'green' : 'red',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '4px 8px',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {isRestaurantOpen(restaurant.horario) ? 'Aberto' : 'Fechado'}
                                        </span>
                                    </div>
                                    <p>{restaurant.descricao}</p>
                                    <p>
                                        {restaurant.localizacao}, {restaurant.cidade} - {restaurant.pais}
                                    </p>
                                    <Button onClick={(e) => { e.stopPropagation(); openReservationModal(restaurant); }}>Reservar Mesa</Button>
                                </div>
                            </RestaurantCard>
                        ))
                ) : (
                    <p>Não há restaurantes disponíveis</p>
                )}
            </RestaurantGrid>


            {restaurantesPopulares.length > 0 && (
                <>
                    <PopularSection>
                        <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>🔥 Restaurantes Populares 🔥</h2>
                        <RestaurantGrid>
                            {restaurantesPopulares.map((restaurant) => (
                                <RestaurantCard key={restaurant.id_restaurante}
                                    onClick={() => handleInfoRestaurant(restaurant)}
                                    style={{ cursor: 'pointer' }}>
                                    <img
                                        src={`data:image/jpeg;base64,${restaurant.imagem}`}
                                        alt={restaurant.nome}
                                    />
                                    <div className="details">
                                        <h3>{restaurant.nome}</h3>
                                        <p>{restaurant.descricao}</p>
                                        <Button onClick={(e) => { e.stopPropagation(); openReservationModal(restaurant); }}>Reservar Mesa</Button>
                                    </div>
                                </RestaurantCard>
                            ))}
                        </RestaurantGrid>
                    </PopularSection>
                </>
            )}

            {showModal && selectedRestaurant && (
                <Modal>
                    <ModalContent>
                        <CloseButton onClick={() => setShowModal(false)}>X</CloseButton>
                        <h2>Reserva no {selectedRestaurant.nome}</h2>



                        <NavigationArrow
                            left
                            onClick={handlePrevStep}
                            disabled={currentStep === 1}
                        >
                            &lt;
                        </NavigationArrow>
                        <NavigationContainer>

                            <div>
                                {currentStep === 1 && (
                                    <>
                                        <ProgressBar>
                                            <ProgressFill width={`${(currentStep - 1) * 25}%`} />
                                        </ProgressBar>
                                        <label>Escolha a Data:</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
                                            required
                                        />

                                    </>
                                )}

                                {currentStep === 2 && (
                                    <>
                                        <ProgressBar>
                                            <ProgressFill width={`${(currentStep - 1) * 25}%`} />
                                        </ProgressBar>
                                        <label>Número de Pessoas:</label>
                                        <input
                                            type="number"
                                            value={numPessoas}
                                            min="1"
                                            onChange={(e) => setNumPessoas(e.target.value)}
                                        />

                                    </>
                                )}

                                {currentStep === 3 && (
                                    <>
                                        <ProgressBar>
                                            <ProgressFill width={`${(currentStep - 1) * 25}%`} />
                                        </ProgressBar>
                                        <label>Escolha o Menu:</label>
                                        <MenuList>
                                            {menus.map(menu => (
                                                <MenuCard key={menu.id_menu} onClick={() => {
                                                    if (selectedMenuIds.includes(menu.id_menu)) {
                                                        setSelectedMenuIds(selectedMenuIds.filter(id => id !== menu.id_menu));
                                                        setSelectedMenuNames(selectedMenuNames.filter(name => name !== menu.nome_prato));
                                                    } else {
                                                        setSelectedMenuIds([...selectedMenuIds, menu.id_menu]);
                                                        setSelectedMenuNames([...selectedMenuNames, menu.nome_prato]);
                                                    }
                                                }}>
                                                    <MenuImage src={`data:image/jpeg;base64,${menu.imagem}`} alt={menu.nome_prato} />
                                                    <MenuDetails>
                                                        <MenuTitle>{menu.nome_prato}</MenuTitle>
                                                        <MenuDescription>{menu.descricao}</MenuDescription>
                                                        <MenuPrice>€{menu.preco}</MenuPrice>
                                                    </MenuDetails>
                                                    <SelectMenuButton
                                                        isSelecionado={selectedMenuIds.includes(menu.id_menu)}
                                                    >
                                                        {selectedMenuIds.includes(menu.id_menu) ? <FaTimes /> : <FaPlus />}
                                                    </SelectMenuButton>
                                                </MenuCard>
                                            ))}
                                        </MenuList>

                                    </>
                                )}

                                {currentStep === 4 && (
                                    <>
                                        <ProgressBar>
                                            <ProgressFill width={`${(currentStep - 1) * 25}%`} />
                                        </ProgressBar>
                                        <label>Escolha o Horário:</label>
                                        <div className="horarios-grid">
                                            {filteredHorarios.length > 0 ? (
                                                filteredHorarios.map(horario => {
                                                    const capacidadeRestante = horario.capacidade_maxima - horario.reservas_atuais;
                                                    const isDisponivel = horario.isDisponivel && capacidadeRestante >= numPessoas;  // Verifica se o horário está disponível para o número de pessoas

                                                    return (
                                                        <HorarioButton
                                                            key={horario.id_horario}
                                                            isSelecionado={selectedHorarioId === horario.id_horario}
                                                            isDisponivel={isDisponivel}  // Marca se o horário está disponível
                                                            onClick={() => isDisponivel && setSelectedHorarioId(horario.id_horario)}  // Só seleciona se estiver disponível
                                                            disabled={!isDisponivel}  // Desabilita o botão se não estiver disponível
                                                        >
                                                            {horario.dia_semana} {horario.hora_inicio} - {horario.hora_fim}
                                                            <br />
                                                            {capacidadeRestante} lugares disponíveis
                                                        </HorarioButton>
                                                    );
                                                })
                                            ) : (
                                                <p>Não há horários disponíveis para esta data.</p>
                                            )}
                                        </div>

                                        <StepButton onClick={handleNextStep}>Finalizar</StepButton>
                                    </>
                                )}

                                {currentStep === 5 && (
                                    <div>
                                        <ProgressBar>
                                            <ProgressFill width={`${(currentStep - 1) * 25}%`} />
                                        </ProgressBar>
                                        <h3>Reserva Confirmada!</h3>
                                        <p>Você reservou uma mesa para {numPessoas} pessoas no {selectedRestaurant.nome}.</p>
                                        <p>Menus escolhidos: {selectedMenuNames.join(', ')}</p>
                                        <Button onClick={() => setShowModal(false)} style={{ width: '100%' }}>Fechar</Button>
                                    </div>
                                )}
                            </div>

                        </NavigationContainer>
                        <NavigationArrow
                            right
                            onClick={handleNextStep}
                            disabled={currentStep === 5}
                        >
                            &gt;
                        </NavigationArrow>
                    </ModalContent>
                </Modal>
            )}

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


            <Footer>
                © {new Date().getFullYear()} MesaFácil - Todos os direitos reservados. Bruno Bita
            </Footer>
        </Container>


    );
};

export default Home;
