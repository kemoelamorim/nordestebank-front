import React, { useEffect, useState } from 'react';
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
  IconButton,
  Modal,
} from '@mui/material';
import styled from './styles.module.css';

import { Link } from 'react-router-dom';
import { ClearOutlined, DeleteFilled, EditFilled, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface IConta {
  id: number;
  titular: string;
  tipoConta: ITipoConta;
  cpfCnpj: string;
  email: string;
  dddTelefone: string;
}

export type ITipoConta = 'FISICA' | 'JURIDICA';


export const ContaList: React.FC = () => {
  const navigate = useNavigate()
  const classes = styled;
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [contas, setContas] = useState<IConta[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Estado para controlar a abertura e o fechamento do modal de exclusão
  const [deletingId, setDeletingId] = useState<number | null>(null); // Estado para armazenar o ID do item que está sendo excluído

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/contas/findAll`);
      const result = await response.json();
      setContas(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuscarConta = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/contas/search?nome=${nome}`);
      if (response.ok) {
        const result = await response.json();
        setContas(result);
        setNotFound(false);
      } else {
        setContas(null);
        setNotFound(true);
      }
    } catch (error) {
      setContas(null);
      setNotFound(true);
    }

    setLoading(false);
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

  const handleEdit = (id: number) => {
    navigate('/endereco/edit', { state : id });
    console.log(`Editar item com ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    console.log(id)
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log(deletingId)
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/contas/delete/${deletingId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
      } else {
        setContas(null);
        setNotFound(true);
      }
    } catch (error) {
      setContas(null);
      setNotFound(true);
    }

    setLoading(false);
    setDeleteModalOpen(false);
  };

  const handleClear = () => {
    setNome('');
    fetchData();
  };

  return (
    <div>
      <div className={classes.search}>
        <TextField
          label="Nome / Razão Social"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          inputProps={{ maxLength: 18 }}
          size='small'
        />
        <div className={classes.btnSearch}>
          <IconButton color='info' onClick={handleBuscarConta}>
            <SearchOutlined />
          </IconButton>
          <IconButton color='warning' onClick={handleClear}>
            <ClearOutlined />
          </IconButton>
        </div>
        
        <Link to="/conta/create">
          <IconButton size="large" color='success' aria-label="Plus">
            <PlusCircleFilled/>
          </IconButton>
        </Link>
      </div>
      {notFound && <div className={classes.mensagem}>Conta não encontrada</div>}

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
                <TableCell>Nome / Razão Social</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Tipo Conta</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contas?.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.titular}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.dddTelefone}</TableCell>
                  <TableCell>{renderTipoContaTag(row.tipoConta)}</TableCell>
                  <TableCell>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(row.id)}>
                      <EditFilled />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
                      <DeleteFilled />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
