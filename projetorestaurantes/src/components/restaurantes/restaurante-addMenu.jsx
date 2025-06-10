import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, FormWrapper, FormTitle, Form, Input, Button, BackButton, Label, FileInput } from '../../styles/AddMenuStyled';

const RestauranteAddMenu = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagem, setImagem] = useState(null);
    const [idMenu, setIdMenu] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser || loggedUser.tipo !== 'restaurante') {
            navigate('/login');
        }

        const menu = location.state?.menu;
        if (menu) {
            setNome(menu.nome_prato);
            setDescricao(menu.descricao);
            setPreco(menu.preco);
            setCategoria(menu.categoria);
            setIdMenu(menu.id_menu);
        }
    }, [navigate, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !descricao || !preco || !categoria) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const loggedUser = JSON.parse(localStorage.getItem('user'));
        const id_utilizador = loggedUser.id;

        const formData = new FormData();
        formData.append('nome_prato', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco);
        formData.append('categoria', categoria);
        formData.append('id_utilizador', id_utilizador);
        if (imagem) formData.append('imagem', imagem);
        if (idMenu) formData.append('id_menu', idMenu); // importante para update

        try {
            const url = idMenu 
                ? 'https://projetorestaurantes.onrender.com/menu/editar'  // endpoint de editar
                : 'https://projetorestaurantes.onrender.com/restaurante/menu'; // endpoint de adicionar

            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.status === 'success') {
                alert(idMenu ? 'Menu atualizado com sucesso!' : 'Menu adicionado com sucesso!');
                navigate('/restaurantes/restauranteMenus');
            } else {
                alert('Erro: ' + response.data.error);
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao enviar o menu. Tente novamente.');
        }
    };

    const BackMenuPage = () => {
        navigate('/restaurantes/restauranteMenus');
    };

    return (
        <Container>
            <FormWrapper>
                <FormTitle>{idMenu ? 'Editar Menu' : 'Adicionar Novo Menu'}</FormTitle>
                <Form onSubmit={handleSubmit}>
                    <Label>Nome do Prato</Label>
                    <Input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite o nome do prato"
                        required
                    />

                    <Label>Descrição</Label>
                    <Input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Digite a descrição do prato"
                        required
                    />

                    <Label>Preço</Label>
                    <Input
                        type="number"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        placeholder="Digite o preço"
                        required
                    />

                    <Label>Categoria</Label>
                   <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', marginBottom: '15px' }}
                >
                    <option value="">Selecione uma categoria</option>
                    <option value="Peixe">Peixe</option>
                    <option value="Carne">Carne</option>
                    <option value="Vegetariano">Vegetariano</option>
                    <option value="Marisco">Marisco</option>
                    <option value="Outro">Outro</option>
                </select>

                    <Label>Imagem (opcional)</Label>
                    <FileInput
                        type="file"
                        onChange={(e) => setImagem(e.target.files[0])}
                    />

                    <Button type="submit">{idMenu ? 'Atualizar Menu' : 'Adicionar Menu'}</Button>
                    <BackButton type="button" onClick={BackMenuPage}>Voltar</BackButton>
                </Form>
            </FormWrapper>
        </Container>
    );
};

export default RestauranteAddMenu;
