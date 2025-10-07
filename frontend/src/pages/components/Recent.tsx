import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

function createData(peerid: string, date: string, time: string) {
    return { peerid, date, time };
}

const rows = [
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '06.10.2025', '12:25'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '05.10.2025', '14:54'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '04.10.2025', '45:02'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '03.10.2025', '43:23'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '02.10.2025', '5:32'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '01.10.2025', '1:23:25'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '30.09.2025', '1:32:07'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '01.09.2025', '45:09'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '26.08.2025', '15:38'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '07.08.2025', '11:89'),
    createData('NPR0n7vHlr5ZwCQVXRaWfm0HLMq3DNd9OnQbLqUJfGv', '23.03.2025', '13:37'),
]

const Root = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ my: 2 }}>{children}</Box>
);

export default function CustomPaginationActionsTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            overflowX: 'hidden',
            margin: 0,
            padding: 0
        }}>
            <Box sx={{
                backgroundRepeat: 'no-repeat',
                width: { xs: '100%', sm: '60%' },
                bgcolor: 'background.default',
                overflowX: 'hidden',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <Container>
                        <Root>
                            <Divider>RECENT CALLS</Divider>
                        </Root>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                {/* Добавлен TableHead с заголовками колонок */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                            PeerID
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: 160 }}>
                                            Date
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: 160 }}>
                                            Time
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : rows
                                    ).map((row) => (
                                        <TableRow key={row.peerid}>
                                            <TableCell>
                                                {row.peerid}
                                            </TableCell>
                                            <TableCell >
                                                {row.date}
                                            </TableCell>
                                            <TableCell>
                                                {row.time}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={3} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[]} // Убраны опции выбора количества строк
                                            colSpan={3}
                                            count={rows.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                            // Скрываем label и селектор для выбора количества строк
                                            labelDisplayedRows={({ from, to, count }) =>
                                                `${from}-${to} of ${count}`
                                            }
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}