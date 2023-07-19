import React, { useState } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import styled from './style.module.css';

interface IConta {
  id: number;
  titular: string;
  tipoConta: ITipoConta;
  cpfCnpj: string;
  email: string;
  dddTelefone: string;
}

export type ITipoConta = 'FISICA' | 'JURIDICA';


export const Dashboard: React.FC = () => {
  const classes = styled;
  const [idConta, setIdConta] = useState('');
  const [conta, setConta] = useState<IConta | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleBuscarConta = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/contas/${idConta}`);
      if (response.ok) {
        const result = await response.json();
        setConta(result);
        setNotFound(false);
      } else {
        setConta(null);
        setNotFound(true);
      }
    } catch (error) {
      setConta(null);
      setNotFound(true);
    }
  };

  const renderTipoContaTag = (tipoConta: ITipoConta) => {
    let tagClassName = `${classes.tag} `;
    if (tipoConta === 'FISICA') {
      tagClassName += classes.fisica;
    } else if (tipoConta === 'JURIDICA') {
      tagClassName += classes.juridica;
    }

    return <div className={tagClassName}>{tipoConta}</div>;
  };

  return (
    <div>
      <Button variant="contained">Criar Conta</Button>
      <TextField
        label="ID Conta"
        value={idConta}
        onChange={(e) => setIdConta(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
        inputProps={{ maxLength: 18 }}
      />
      <Button variant="contained" onClick={handleBuscarConta}>
        Buscar Conta
      </Button>

      {notFound && <div className={classes.mensagem}>Conta não encontrada</div>}

      {conta && (
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            {renderTipoContaTag(conta.tipoConta)}
            <div>ID: {conta.id}</div>
            <div>Titular: {conta.titular}</div>
            <div>CPF/CNPJ: {conta.cpfCnpj}</div>
            <div>Email: {conta.email}</div>
            <div>DDD Telefone: {conta.dddTelefone}</div>
           
          </CardContent>
        </Card>
      )}
    </div>
  );
};
