import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  Typography, 
  Button, 
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Donor } from "../types/donor";

interface DonorTableProps {
  donors: Donor[];
  handleDeleteDonor: (id: string) => void;
  handleEditDonor: (donor: Donor) => void;
}

const DonorTable: React.FC<DonorTableProps> = ({ donors, handleDeleteDonor, handleEditDonor }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Responsive table headers configuration
  const getVisibleHeaders = () => {
    if (isExtraSmallScreen) {
      return ["Name", "Blood", "Eligible", "Actions"];
    }
    if (isSmallScreen) {
      return ["Name", "Blood Group", "Last Donation", "Eligible", "Actions"];
    }
    return [
      "Name",
      "Blood Group",
      "Last Donation",
      "Weight",
      "Hemoglobin",
      "Allergies",
      "Eligible",
      "City",
      "Contact",
      "Actions",
    ];
  };

  // Responsive cell rendering
  const renderTableCell = (header: string, donor: Donor) => {
    switch (header) {
      case "Name":
        return donor.name;
      case "Blood":
      case "Blood Group":
        return `${donor.bloodGroup}${donor.rhFactor === 'Positive' ? '+' : '-'}`;
      case "Last Donation":
        return new Date(donor.lastDonationDate).toLocaleDateString();
      case "Weight":
        return `${donor.weight} kg`;
      case "Hemoglobin":
        return `${donor.hemoglobinLevel} g/dL`;
      case "Allergies":
        return donor.allergies?.substring(0, 15) + (donor.allergies?.length > 15 ? "..." : "");
      case "Eligible":
        return donor.eligible ? (
          <Typography color="success.main">Yes</Typography>
        ) : (
          <Typography color="error.main">No</Typography>
        );
      case "City":
        return donor.city;
      case "Contact":
        return donor.contact;
      case "Actions":
        return (
          <Box display="flex" gap={1}>
            <Tooltip title="Edit">
              <IconButton 
                onClick={() => handleEditDonor(donor)}
                color="primary"
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                onClick={() => handleDeleteDonor(donor.id)}
                color="error"
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      default:
        return "";
    }
  };

  return (
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden', 
      borderRadius: 2, 
      boxShadow: 3,
      '& .MuiTable-root': {
        minWidth: 'max-content'
      }
    }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table 
          stickyHeader
          aria-label="donor table"
          sx={{
            '& .MuiTableCell-root': {
              py: isExtraSmallScreen ? 1 : 1.5,
              px: isExtraSmallScreen ? 1 : 2,
            },
            '& .MuiTableCell-head': {
              fontWeight: 'bold',
            }
          }}
        >
          <TableHead>
            <TableRow>
              {getVisibleHeaders().map((head) => (
                <TableCell 
                  key={head} 
                  sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {donors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={getVisibleHeaders().length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No donors found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              donors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((donor) => (
                <TableRow 
                  key={donor.id}
                  hover
                  sx={{ 
                    '&:nth-of-type(even)': { 
                      backgroundColor: theme.palette.action.hover 
                    },
                    '&:last-child td': { 
                      borderBottom: 0 
                    }
                  }}
                >
                  {getVisibleHeaders().map((header) => (
                    <TableCell key={`${donor.id}-${header}`}>
                      <Typography variant="body2" noWrap>
                        {renderTableCell(header, donor)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={donors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            px: isExtraSmallScreen ? 1 : 2,
          }
        }}
      />
    </Paper>
  );
};

export default DonorTable;