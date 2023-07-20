import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
} from '@mui/material';

import { useLocation, useNavigate } from 'react-router-dom';

export interface IConta {
  id: number,
  titular: string;
  tipoConta: ITipoConta;
  cpfCnpj: string;
  email: string;
  dddTelefone: string;
}
export interface IEndereco {
  id: number,
  tipoEndereco: ITipoEndereco,
  cep: string,
  logradouro: string,
  numero: string,
  bairro: string,
  localidade: string,
  uf: string,
  complemento: string,
  conta?: IConta 
}

export type ITipoEdereco = "RESIDENCIAL" | "COMERCIAL";
export const EnderecoEdit: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const id = location.state.idEndereco
  const idConta = location.state.idConta
  const [loading, setLoading] = useState(true);
  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    const fetchEndereco = async () => {
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:8080/api/enderecos/${id}`);
        const result = await response.json();
        setEndereco(result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchEndereco();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEndereco((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    // PUT request to http://localhost:8080/api/enderecos/update
    var conta: IConta = {
      id: idConta
    }
    endereco.conta = conta;
    await fetch(`http://localhost:8080/api/enderecos/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      
       body: JSON.stringify(endereco),
    })
      .then(response => {
        
        if (response.ok) {
          navigate("/conta/edit", {state: idConta})
        } else {
          // Handle error message
          console.log('Erro ao atualizar o endereço.');
        }
      })
      .catch(error => {
        // Handle error message
        console.error('Failed to update endereco:', error);
      });
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>Editar Endereço</h1>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="logradouro"
                  label="Logradouro"
                  value={endereco?.logradouro}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="numero"
                  label="Número"
                  value={endereco?.numero}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="bairro"
                  label="Bairro"
                  value={endereco?.bairro}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="complemento"
                  label="Complemento"
                  value={endereco?.complemento}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                  Atualizar
                </Button>
              </Grid>
            </Grid>
          </form>
        </>
      )}
    </div>
  );
}