import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { Container, FormWrapper, Title, Input, Button, ErrorMessage, RegisterLink } from '../styles/AuthStyled';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginData = { email, password };

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login bem-sucedido', data);


                // guardar os dados do utlizar no localstorage
                localStorage.setItem('user', JSON.stringify(data.utilizador));

                 
                if(data.utilizador.tipo === 'cliente'){
                  navigate('/clientes/home'); 
                }
                else if(data.utilizador.tipo === 'restaurante')
                {
                  navigate('/restaurantes/home-restaurante');
                }
                else if(data.utilizador.tipo === 'admin')
                {
                  navigate('/admin/HomeAdmin');
                }   
            } else {
                //setError(data.error || 'Erro ao fazer login');
                showMessage('Erro ao iniciar sessão', 'error');

            }
        } catch (error) {
            //setError('Erro ao conectar com o servidor');
            showMessage('Erro ao conectar com o servidor', 'error');

        }
        setLoading(false);
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
          <FormWrapper>
            <Title>Iniciar Sessão</Title>
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <Button type="submit">Entrar</Button>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </form>
            <RegisterLink>
              Ainda não tem uma conta?{' '}
              <button onClick={() => navigate('/register')}>Registe-se aqui</button>
              <button onClick={() => navigate('/restaurantes/pedidoDeRegisto')}>Queres registar o teu restaurante?</button>
            </RegisterLink>
          </FormWrapper>

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
    
    export default Login;