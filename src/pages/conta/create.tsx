import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
  Button,
  Typography,
} from '@mui/material';

import { IConta, ITipoConta } from 'interfaces';
import { useNavigate } from 'react-router-dom';

export const ContaCreate: React.FC = () => {
  const navigate = useNavigate();

  const [conta, setConta] = useState<IConta>({
    id: 0,
    titular: '',
    tipoConta: 'FISICA',
    cpfCnpj: '',
    email: '',
    dddTelefone: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<"FISICA" | "JURIDICA">) => {
    const { value } = e.target;
    setConta((prevState) => ({
      ...prevState,
      tipoConta: value as ITipoConta,
    }));
  };

  const handleFormSubmit = () => {
    // Validation: Check if all fields are filled
    if (
      conta.titular.trim() === '' ||
      conta.cpfCnpj.trim() === '' ||
      conta.email.trim() === '' ||
      conta.dddTelefone.trim() === ''
    ) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setSuccessMessage('');
      return;
    }

    // POST request to http://localhost:8080/api/contas/save
    fetch('http://localhost:8080/api/contas/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conta),
    })
      .then(response => {
        if (response.ok) {
          setErrorMessage('');
          setSuccessMessage('Conta criada com sucesso!');
          setTimeout(() => {
            navigate('/contas');
          }, 2000);
        } else {
          setErrorMessage('Ocorreu um erro ao criar a conta.');
          setSuccessMessage('');
        }
      })
      .catch(error => {
        setErrorMessage('Ocorreu um erro ao criar a conta.');
        setSuccessMessage('');
        console.error('Failed to create conta:', error);
      });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="tipo-conta-label">Tipo de Conta</InputLabel>
            <Select
              labelId="tipo-conta-label"
              id="tipo-conta-select"
              name="tipoConta"
              value={conta.tipoConta}
              onChange={handleSelectChange}
              label="Tipo de Conta"
            >
              <MenuItem value="FISICA">Física</MenuItem>
              <MenuItem value="JURIDICA">Jurídica</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="titular"
            label={conta.tipoConta === 'FISICA' ? 'Nome' : 'Razão Social'}
            value={conta.titular}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="cpfCnpj"
            label={conta.tipoConta === 'FISICA' ? 'CPF' : 'CNPJ'}
            value={conta.cpfCnpj}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email"
            value={conta.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="dddTelefone"
            label="DDD + Telefone"
            value={conta.dddTelefone}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleFormSubmit}>
            Cadastrar
          </Button>
        </Grid>
        {errorMessage && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          </Grid>
        )}
        {successMessage && (
          <Grid item xs={12}>
            <Typography variant="body1" color="success">
              {successMessage}
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};
