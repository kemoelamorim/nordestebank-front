import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export interface IEndereco {
  id: number,
  tipoEndereco: ITipoEndereco,
  cep: string,
  logradouro: string,
  numero: string,
  bairro: string,
  localidade: string,
  uf: string,
  complemento: string
}

export type ITipoEdereco = "RESIDENCIAL" | "COMERCIAL";

export const EnderecoCreate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const id = location.state;
  const [endereco, setEndereco] = useState({
    id: 0,
    tipoEndereco: 'RESIDENCIAL',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    localidade: '',
    uf: '',
    complemento: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEndereco((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    // Validation: Check if all fields are filled
    if (
      endereco.logradouro.trim() === '' ||
      endereco.numero.trim() === '' ||
      endereco.bairro.trim() === '' ||
      endereco.localidade.trim() === '' ||
      endereco.uf.trim() === '' 
    ) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setSuccessMessage('');
      return;
    }

    // POST request to http://localhost:8080/api/enderecos/save
    await fetch(`http://localhost:8080/api/enderecos/save/conta/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(endereco),
    })
      .then(response => {
        if (response.ok) {
          setErrorMessage('');
          setSuccessMessage('Endereço criado com sucesso!');
          setTimeout(() => {
            navigate('/conta/edit',{state: id});
          }, 2000);
        } else {
          setErrorMessage('Ocorreu um erro ao criar o endereço.');
          setSuccessMessage('');
        }
      })
      .catch(error => {
        setErrorMessage('Ocorreu um erro ao criar o endereço.');
        setSuccessMessage('');
        console.error('Failed to create endereco:', error);
      });
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    if (cep) {
      try {
        const response = await fetch(`http://localhost:8080/api/enderecos/viacep/${cep}`);
        if (response.ok) {
          const result = await response.json();
          setEndereco(prevState => ({
            ...prevState,
            cep: result.cep || '',
            logradouro: result.logradouro || '',
            bairro: result.bairro || '',
            localidade: result.localidade || '',
            uf: result.uf || '',
            complemento: result.complemento || '',
          }));
        } else {
          setErrorMessage('CEP não encontrado.');
        }
      } catch (error) {
        setErrorMessage('Ocorreu um erro ao buscar o CEP.');
        console.error('Failed to fetch CEP:', error);
      }
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="cep"
            label="CEP"
            value={endereco.cep}
            onChange={handleInputChange}
            onBlur={handleCepBlur}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="numero"
            label="Número"
            value={endereco.numero}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="logradouro"
            label="Logradouro"
            value={endereco.logradouro}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="uf"
            label="UF"
            value={endereco.uf}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="localidade"
            label="Cidade"
            value={endereco.localidade}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="bairro"
            label="Bairro"
            value={endereco.bairro}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="complemento"
            label="Complemento"
            value={endereco.complemento}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleFormSubmit}>
            Criar
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
