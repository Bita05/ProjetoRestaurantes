import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
    FaMapMarkerAlt, FaClock, FaPhoneAlt, FaStar,
    FaSignOutAlt, FaCog, FaUser
} from 'react-icons/fa';
import Slider from "react-slick";
import {
    Container, Heading, Image, InfoSection, MenuSection,
    CarouselItem, Footer, MapSection, DetailsSection,
    LeftDetails, RightDetails, RatingContainer
} from '../../styles/Clientes';
import {
    Header, Button, LogoutButton, SettingsButton, UserSection
} from '../../styles/HomeStyled';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        if (!restaurante && id) {
            fetch('http://localhost:8080/restaurante/getById', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') setRestaurante(data.restaurante);
                })
                .catch(console.error);
        }
    }, [id, restaurante]);

    useEffect(() => {
        if (restaurante) {
            fetch('http://localhost:8080/restaurante/listarMenu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: restaurante.id_restaurante })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success' && Array.isArray(data.pratos))
                        setMenus(data.pratos);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [restaurante]);

    useEffect(() => {
        if (restaurante) {
            fetch('http://localhost:8080/horariosRestaurante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_restaurante: restaurante.id_restaurante })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success' && Array.isArray(data.horarios))
                        setHorarios(data.horarios);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [restaurante]);

    if (loading) return <p>Carregando dados do restaurante...</p>;

    const horariosAgrupados = horarios.reduce((acc, { dia_semana, hora_inicio, hora_fim }) => {
        acc[dia_semana] = acc[dia_semana] || [];
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

            <Heading>{restaurante.nome}</Heading>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', marginTop: '1rem', width: '100%', maxWidth: '900px' }}>
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


            <Image src={`data:image/jpeg;base64,${restaurante.imagem}`} alt={restaurante.nome} />
            <MenuSection>
                <h3>Menus</h3>
                {menus.length > 0 ? (
                    <Slider
                        dots
                        infinite={menus.length > 3}
                        speed={500}
                        slidesToShow={3}
                        slidesToScroll={1}
                        autoplay={menus.length > 3}
                        autoplaySpeed={3000}
                        responsive={[
                            { breakpoint: 1024, settings: { slidesToShow: 2 } },
                            { breakpoint: 600, settings: { slidesToShow: 1 } }
                        ]}
                    >
                        {menus.map(menu => (
                            <CarouselItem key={menu.id_menu}>
                                <img src={`data:image/jpeg;base64,${menu.imagem}`} alt={menu.nome_prato} />
                                <p>{menu.nome_prato}</p>
                                <p>{menu.descricao}</p>
                                <p style={{ color: '#f39c12', fontWeight: 'bold' }}>Preço: € {menu.preco}</p>
                            </CarouselItem>
                        ))}
                    </Slider>
                ) : (
                    <p>Não há menus disponíveis para este restaurante.</p>
                )}
            </MenuSection>

            <DetailsSection>
                <LeftDetails>
                    <h3>Mais Detalhes</h3>
                    <p><strong>Segunda a Sexta</strong>: {restaurante.horario || 'Não definido'}</p>

                    <h3>Horários de Funcionamento</h3>
                    {Object.keys(horariosAgrupados).length > 0 ? (
                        Object.entries(horariosAgrupados).map(([dia, horas]) => (
                            <p key={dia}><strong>{dia}</strong>: {horas.join(', ')}</p>
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

            <Footer>© 2025 MesaFacil - Todos os direitos reservados</Footer>
        </Container>
    );
};

export default RestauranteInfo;
