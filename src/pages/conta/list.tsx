import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, TextField, Button, CircularProgress, makeStyles } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import stylos from  "./styles.module.css";


export const ContaList: React.FC = () => {
    
    const classes = stylos;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        // Fazer a requisição para o backend, passando os parâmetros de filtro e páginação
        // Substitua a URL pela URL correta do seu backend
        let response;
        if(filter === ''){
            response = await fetch(`http://localhost:8080/api/contas?page=${page}&size=${3}`);
        }else{
            response = await fetch(`http://localhost:8080/api/contas?page=${1}&size=${1}&search=${filter}`);
        }
        
        console.log(response)
        
        const result = await response.json();
        setData(result.content);
        
        setTotalPages(result.totalPages);
        setLoading(false);
    };

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

    const handlePageChange = (event: any, value: any) => {
        setPage(value);
    };

    useEffect(() => {
        fetchData();
    }, [filter, page]);

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
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    {/* Adicione mais colunas conforme necessário */}
                </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row: any) => (
                    <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.titular}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        )}

        <div className={classes.pagination}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} />
        </div>
        </div>
    );
};

  
