import { MouseEvent, useContext, useEffect, useState } from 'react';
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
import Typography from '@mui/material/Typography';
import { TablePaginationActionsProps } from '@/types/utilTypes';
import { convertToCurrency } from '@/libs/formatter';
import styles from './TransactionsGrid.module.css';
import AppContext from '@/src/context/context';
import { useTransactionsQuery } from '@/src/utils/customHooks';

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
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
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
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

function createRow(
  date: string,
  time: string,
  total: string,
  paymentId: string,
  cardName: string,
  last4: string
) {
  return { date, time, total, paymentId, cardName, last4 };
}

export default function CustomPaginationActionsTable() {
  const { ctx } = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rows, setRows] = useState([]);

  const { data, client } = useTransactionsQuery();

  let results = [];
  useEffect(() => {
    client.refetchQueries({
      include: 'active',
    });

    if (data?.customerTransactionsResult != null) {
      results = data.customerTransactionsResult.dataFormatted;

      const mapped = results.map((row) => {
        return createRow(
          new Date(row.created * 1000).toLocaleDateString(),
          new Date(row.created * 1000).toLocaleTimeString(),

          convertToCurrency(row.amount),
          row.cardName,
          row.cardId,
          row.id
        );
      });

      setRows(mapped);
    }
  }, [data, ctx.cart, ctx.accessToken]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <div>
        <Typography
          className={styles.header}
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
        >
          Transactions
        </Typography>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Time</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Card Type</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Last 4</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Payment ID</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.time}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.total}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.paymentId}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.cardName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.last4}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter className={styles.footer}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
          <caption>
            Please note that payments made through the Stripe API can take up to
            30 minutes to appear in this list but will usually appear much
            sooner!
          </caption>
        </Table>
      </div>
    </TableContainer>
  );
}
