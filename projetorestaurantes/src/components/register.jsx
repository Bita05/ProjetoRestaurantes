import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  Container,
  FormWrapper,
  Title,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
  RegisterLink
} from '../styles/AuthStyled';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');


  const ValidarTelemovel = (telefone) => {
    const regex = /^((9[1236])|(2\d)|(800)|(808)|(707))\d{7}$/;
    return regex.test(telefone);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as senhas coincidem novamente por questoes de segurança
    if (password !== confirmPassword) {
      //setError('As passwords têm de ser iguais!');
      showMessage('As passwords têm de ser iguais!', 'error')
      return;
    }

    if (!ValidarTelemovel(telefone)) {
      //setError('Deve indicar um numero de telefone válido!');
      showMessage('Deve indicar um número de telefone válido!', 'error')
      return;
    }


    const signupData = { nome, email, telefone, password, confirmPassword };

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registo bem-sucedido! Inicie Sessão.');
        showMessage('Registo Bem-Sucedido!', 'success')
        setError('');
      } else {
        setError(data.error || 'Erro ao fazer registo');
        showMessage('Erro ao registar-se!', 'error')
      }
    } catch (error) {
      //setError('Erro ao conectar com o servidor');
      showMessage('Erro no servidor!', 'error')
    }
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
        <Title>Registar</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            required
            maxLength={9}
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar password"
            required
          />
          <Button type="submit">Criar Conta</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        </form>
        <RegisterLink>
          Já tem uma conta? <button onClick={() => navigate('/login')}>Inicie Sessão</button>
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

export default Register;
