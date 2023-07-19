import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

import styled from './styles.module.css';

export const ContaList: React.FC = () => {
  const classes = styled
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    // Fazer a requisição para o backend, passando o parâmetro de filtro
    // Substitua a URL pela URL correta do seu backend
    let response;
    response = await fetch(`http://localhost:8080/api/contas/findAll`);

    const result = await response.json();
    setData(result);
    setLoading(false);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleSearch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    // Lógica para editar o item com o ID fornecido
    console.log(`Editar item com ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Lógica para excluir o item com o ID fornecido
    console.log(`Excluir item com ID: ${id}`);
  };

  return (
    <div className={classes.root}>
      <TextField
        label="Filtro"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" onClick={handleSearch}>
        Buscar
      </Button>

      {loading ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>TITULAR</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>TELEFONE</TableCell>
                <TableCell>TIPO CONTA</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.titular}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.dddTelefone}</TableCell>
                  <TableCell>{row.tipoConta}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(row.id)}>Edit</Button>
                    <Button onClick={() => handleDelete(row.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};