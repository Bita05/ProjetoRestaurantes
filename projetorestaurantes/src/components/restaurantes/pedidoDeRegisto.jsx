import React, { useState } from 'react';
import { Container, FormWrapper, Title, Input, Button, ErrorMessage } from '../../styles/AuthStyled';

const PedidoDeRegisto = () => {
    const [restaurantData, setRestaurantData] = useState({
        nome: '',
        email: '',
        telefone: '',
    });

    const [file, setFile] = useState(null);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


       const ValidarTelemovel = (telefone) => {
    const regex = /^((9[1236])|(2\d)|(800)|(808)|(707))\d{7}$/;
    return regex.test(telefone);
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validação extra: garantir que o ficheiro foi escolhido
        if (!file) {
            setError('Por favor, envie o comprovativo de morada.');
            return;
        }

         if (!ValidarTelemovel(restaurantData.telefone)) {
                setError('Deve indicar um número de telefone válido!');
                return;
         }



        try {
            const formData = new FormData();
            formData.append('nome', restaurantData.nome);
            formData.append('email', restaurantData.email);
            formData.append('telefone', restaurantData.telefone);
            formData.append('comprovativo', file);

            const response = await fetch('http://localhost:8080/admin/pedidoRegisto', {
                method: 'POST',
                body: formData, // multipart/form-data automático
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Pedido de registo enviado com sucesso! Aguarde a aprovação do administrador.');
                setRestaurantData({ nome: '', email: '', telefone: '' });
                setFile(null);
                e.target.reset();  // Limpa o input file visualmente
            } else {
                setError(data.error || 'Ocorreu um erro ao processar seu pedido.');
            }
        } catch (error) {
            setError('Erro ao conectar ao servidor. Tente novamente.');
        }
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Pedido de Registo Restaurante</Title>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <ErrorMessage>{error}</ErrorMessage>}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Input
                        type="text"
                        name="nome"
                        value={restaurantData.nome}
                        onChange={handleChange}
                        placeholder='Nome Restaurante'
                        required
                    />
                    <Input
                        type="email"
                        name="email"
                        value={restaurantData.email}
                        onChange={handleChange}
                        placeholder='Email'
                        required
                    />
                    <Input
                        type="tel"
                        name="telefone"
                        value={restaurantData.telefone}
                        onChange={handleChange}
                        placeholder='Telefone'
                        required
                    />

                    <label htmlFor="comprovativo" style={{ display: 'block', margin: '10px 0 5px' }}>
                        Comprovativo de Morada (PDF, JPG, PNG) *
                    </label>
                    <Input
                        type="file"
                        name="comprovativo"
                        id="comprovativo"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                    />
                    <Button type="submit" style={{ marginTop: '15px' }}>Pedir Registo</Button>
                </form>
            </FormWrapper>
        </Container>
    );
};

export default PedidoDeRegisto;
