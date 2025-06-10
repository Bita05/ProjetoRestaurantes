import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaStar, FaSignOutAlt, FaCog, FaUser } from 'react-icons/fa';
import {Header,Banner,Button,LogoutButton,SettingsButton,UserSection } from '../../styles/HomeStyled';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Container, Heading, Image, Description, InfoSection, MenuSection, Carousel, CarouselItem, ReserveSection, ButtonContainer, ReserveButton, Footer, MapSection, DetailsSection, LeftDetails, RightDetails, RatingContainer } from '../../styles/Clientes';

const RestauranteInfo = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurante, setRestaurante] = useState(state?.restaurante || null);
    const [menus, setMenus] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); 


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
    }, []);

    
    useEffect(() => {
        if (!restaurante && id) {
            fetch('https://projetorestaurantes.onrender.com/restaurante/getById', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        setRestaurante(data.restaurante);
                    } else {
                        console.error('Erro ao buscar restaurante:', data.error);
                    }
                })
                .catch(err => {
                    console.error('Erro na requisição:', err);
                    setRestaurante(null);
                });
        }
    }, [id, restaurante]);

    // Fetch menu items
    useEffect(() => {
        if (restaurante) {
            fetch('https://projetorestaurantes.onrender.com/restaurante/listarMenu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: restaurante.id_restaurante })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Resposta da requisição dos pratos:", data);

                    if (data.status === 'success' && Array.isArray(data.pratos) && data.pratos.length > 0) {
                        setMenus(data.pratos);
                    } else {
                        console.error('Erro ao buscar pratos:', data.error);
                        setMenus([]);
                    }
                })
                .catch(err => {
                    console.error('Erro na requisição dos pratos:', err);
                    setMenus([]);
                })
                .finally(() => setLoading(false));
        }
    }, [restaurante]);

    // Fetch horarios de funcionamento do restaurante
    useEffect(() => {
        if (restaurante) {
            fetch('https://projetorestaurantes.onrender.com/horariosRestaurante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: restaurante.id_restaurante })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success' && Array.isArray(data.horarios) && data.horarios.length > 0) {
                        setHorarios(data.horarios);
                    } else {
                        console.error('Erro ao buscar horários:', data.error);
                        setHorarios([]);
                    }
                })
                .catch(err => {
                    console.error('Erro na requisição dos horários:', err);
                    setHorarios([]);
                })
                .finally(() => setLoading(false));
        }
    }, [restaurante]);

    if (loading) return <p>Carregando dados do restaurante...</p>;

    // Organiza os horários agrupando os horários por dia da semana
    const horariosAgrupados = horarios.reduce((acc, horario) => {
        const { dia_semana, hora_inicio, hora_fim } = horario;
        
        if (!acc[dia_semana]) {
            acc[dia_semana] = [];
        }
        
        acc[dia_semana].push(`${hora_inicio} - ${hora_fim}`);
        return acc;
    }, {});

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
                            <SettingsButton onClick={() => navigate('/settings')}>
                                <FaCog />
                            </SettingsButton>
                            <LogoutButton
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    setUser(null); // Limpa o estado do usuário
                                }}
                            >
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

            <div style={{ marginTop: '2rem' }}>
                <Heading>{restaurante.nome}</Heading>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <InfoSection>
                        <p><FaMapMarkerAlt style={{ marginRight: '8px' }} /> <strong>Localização:</strong> {restaurante.localizacao}, {restaurante.cidade} - {restaurante.pais}</p>
                        <p><FaClock style={{ marginRight: '8px' }} /> <strong>Horário:</strong> {restaurante.horario || 'Não definido'}</p>
                    </InfoSection>
                    <RatingContainer>
                        <h3>Avaliação</h3>
                        <div className="rating-stars">
                            {[...Array(5)].map((_, index) => (
                                <span key={index} className={index < 4.5 ? 'filled' : ''}>
                                    <FaStar size={30} color={index < 4.5 ? '#f39c12' : '#ddd'} />
                                </span>
                            ))}
                        </div>
                        <p>Nota: 4.5/5</p>
                    </RatingContainer>
                </div>
            </div>

            <div style={{ display: 'flex', marginTop: '2rem' }}>
                <div style={{ flex: '1 1 50%' }}>
                    <Image
                        src={`data:image/jpeg;base64,${restaurante.imagem}`}
                        alt={restaurante.nome}
                    />
                </div>

                <div style={{ flex: '1 1 50%', paddingLeft: '20px' }}>
                <MenuSection>
                <h3>Menus</h3>

                {menus.length > 0 ? (
                    <Slider
                    dots={true}
                     infinite={menus.length > 3}
                    speed={500}
                    slidesToShow={3} 
                    slidesToScroll={1}
                    swipeToSlide={true}
                    enterMode={menus.length === 3}
                    autoplay={menus.length > 3} 
                    autoplaySpeed={3000}
                    vertical={false}
                    responsive={[
                        {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                        }
                        },
                        {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                        }
                        }
                    ]}
                    style={{ padding: "0 10px" }}
                    >
                    {menus.map(menu => (
                        <CarouselItem key={menu.id_menu} style={{ padding: "10px" }}>
                        <img
                            src={`data:image/jpeg;base64,${menu.imagem}`} 
                            alt={menu.nome_prato}
                            style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                        />
                        <p style={{ fontWeight: 'bold', marginTop: '8px' }}>{menu.nome_prato}</p>
                        <p style={{ fontStyle: 'italic', fontSize: '0.9rem', minHeight: '40px' }}>{menu.descricao}</p>
                        <p style={{ color: '#27ae60', fontWeight: 'bold' }}>Preço: € {menu.preco}</p>
                        </CarouselItem>
                    ))}
                    </Slider>
                ) : (
                    <p>Não há menus disponíveis para este restaurante.</p>
                )}
                </MenuSection>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <h2>4.5 / 5</h2>
                        <div style={{ fontSize: '3rem', color: '#f39c12' }}>
                            {[...Array(5)].map((_, index) => (
                                <span key={index} className={index < 4.5 ? 'filled' : ''}>
                                    <FaStar size={40} color={index < 4.5 ? '#f39c12' : '#ddd'} />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ReserveSection style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h3>Reserve uma mesa</h3>
                <ReserveButton onClick={() => alert("Funcionalidade de reserva em breve!")}>Reservar Agora</ReserveButton>
            </ReserveSection>

            <DetailsSection>
                <LeftDetails>
                    <h3>Mais Detalhes</h3>
                    <p><strong>Segunda a Sexta</strong>: {restaurante.horario || 'Não definido'}</p>

                    <h3>Horários de Funcionamento</h3>
                    {Object.keys(horariosAgrupados).length > 0 ? (
                        Object.keys(horariosAgrupados).map(dia => (
                            <p key={dia}>
                                <strong>{dia}</strong>: {horariosAgrupados[dia].join(', ')}
                            </p>
                        ))
                    ) : (
                        <p>Horários não disponíveis.</p>
                    )}
                </LeftDetails>

                <RightDetails>
                    <h3>Localização</h3>
                    <MapSection>
                        <iframe
                            title="Localização do Restaurante"
                            width="100%"
                            height="400"
                            src={`https://www.google.com/maps/embed/v1/place?q=${restaurante.localizacao}+${restaurante.cidade}+${restaurante.pais}&key=AIzaSyCe3PFRF_-4yFpOadBgNfHLpTyGZNErttU`}
                            allowFullScreen
                        />
                    </MapSection>
                </RightDetails>
            </DetailsSection>

            <Footer>
                <p>© 2025 MesaFacil - Todos os direitos reservados</p>
            </Footer>
        </Container>
    );
};

export default RestauranteInfo;
