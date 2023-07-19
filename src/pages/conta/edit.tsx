import React, { useEffect, useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  IconButton,
  Modal,
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
import styled from './styles.module.css';

import { ClearOutlined, DeleteFilled, EditFilled, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { IConta, IEndereco, ITipoConta } from 'interfaces';
import { useLocation } from 'react-router-dom';

export const ContaEdit: React.FC = () => {
  const location = useLocation();
  const id = location.state;
  const classes = styled;
  const [loading, setLoading] = useState(true);
  const [conta, setConta] = useState<IConta | null>(null);
  const [enderecos, setEnderecos] = useState<IEndereco[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Estado para controlar a abertura e o fechamento do modal de exclusão
  const [deletingId, setDeletingId] = useState<number | null>(null); // Estado para armazenar o ID do item que está sendo excluído

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConta((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  

  const handleConfirmDelete = async () => {
    console.log(deletingId)
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/enderecos/delete/${deletingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchEnderecos()
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    }

    setLoading(false);
    setDeleteModalOpen(false);
  };

  const handleSelectChange = (e: SelectChangeEvent<"FISICA" | "JURIDICA">) => {
    const { value } = e.target;
    setConta((prevState: any) => ({
      ...prevState,
      tipoConta: value as ITipoConta,
    }));
  };

  const handleFormSubmit = async () => {
    console.log(conta)
    // POST request to http://localhost:8080/api/contas/update
    await fetch(`http://localhost:8080/api/contas/update`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conta),
    })
      .then(response => {
        if (response.ok) {
          // Handle success message or redirect if needed
          console.log('Conta atualizada com sucesso!');
        } else {
          // Handle error message
          console.log('Erro ao atualizar a conta.');
        }
      })
      .catch(error => {
        // Handle error message
        console.error('Failed to update conta:', error);
      });
  };
  
  const fetchConta = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/contas/${id}`);
      const result = await response.json();
      setConta(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchEnderecos = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/enderecos/findAll/conta/${id}`);
      const result = await response.json();
      setEnderecos(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchConta();
    fetchEnderecos();
  }, [id]);
  
  const renderTipoContaTag = (tipoConta: ITipoConta) => {
    let tagClassName = `${classes.tag} `;
    if (tipoConta === 'FISICA') {
      tagClassName += classes.fisica;
    } else if (tipoConta === 'JURIDICA') {
      tagClassName += classes.juridica;
    }

    return <div className={tagClassName}>{tipoConta}</div>;
  };

  const handleDelete = (id: number) => {
    console.log("BATEU AQUI")
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div>
      {loading ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div>
            <h1>Editar Conta</h1>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="tipo-conta-label">Tipo de Conta</InputLabel>
                  <Select
                    labelId="tipo-conta-label"
                    id="tipo-conta-select"
                    name="tipoConta"
                    value={conta?.tipoConta}
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
                  label={conta?.tipoConta === 'FISICA' ? 'Nome' : 'Razão Social'}
                  value={conta?.titular}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="cpfCnpj"
                  label={conta?.tipoConta === 'FISICA' ? 'CPF' : 'CNPJ'}
                  value={conta?.cpfCnpj}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  value={conta?.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="dddTelefone"
                  label="DDD + Telefone"
                  value={conta?.dddTelefone}
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
          </div>
          <div>
            <h2>Endereços</h2>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Logradouro</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Bairro</TableCell>
                    <TableCell>Complemento</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enderecos.map((endereco) => (
                    <TableRow key={endereco.id}>
                      <TableCell>{endereco.id}</TableCell>
                      <TableCell>{endereco.logradouro}</TableCell>
                      <TableCell>{endereco.numero}</TableCell>
                      <TableCell>{endereco.bairro}</TableCell>
                      <TableCell>{endereco.complemento}</TableCell>
                      <TableCell>
                        <IconButton aria-label="Edit">
                          <EditFilled />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDelete(endereco.id)}>
                          <DeleteFilled />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
      {/* Modal de confirmação de exclusão */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className={classes.modalContent}>
          <h2>Confirmar exclusão</h2>
          <p>Deseja realmente excluir o item?</p>
          <div className={classes.modalActions}>
            <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
              Confirmar
            </Button>
            <Button variant="contained" color="error" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
