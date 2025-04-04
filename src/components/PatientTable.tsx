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
  Paper,
  IconButton,
  Tooltip,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface Patient {
  id: string;
  name: string;
  age: string;
  bloodGroup: string;
  rhFactor: string;
  city: string;
  contact: string;
}

interface PatientTableProps {
  patients: Patient[];
  handleEditPatient: (patient: Patient) => void;
  handleDeletePatient: (id: string) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  handleEditPatient,
  handleDeletePatient,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  // Define responsive headers for different screen sizes
  const getVisibleHeaders = () => {
    if (isExtraSmallScreen) {
      return ["Name", "Blood", "Actions"];
    }
    if (isSmallScreen) {
      return ["Name", "Age", "Blood Group", "City", "Actions"];
    }
    return ["Name", "Age", "Blood Group", "Rh Factor", "City", "Contact", "Actions"];
  };

  // Render each cell based on header name
  const renderTableCell = (header: string, patient: Patient) => {
    switch (header) {
      case "Name":
        return patient.name;
      case "Age":
        return patient.age;
      case "Blood":
      case "Blood Group":
        return patient.bloodGroup;
      case "Rh Factor":
        return patient.rhFactor;
      case "City":
        return patient.city;
      case "Contact":
        return patient.contact;
      case "Actions":
        return (
          <Box display="flex" gap={1}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEditPatient(patient)}
                color="primary"
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeletePatient(patient.id)}
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
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 3,
        "& .MuiTable-root": {
          minWidth: "max-content",
        },
      }}
    >
      <TableContainer sx={{ maxHeight: "calc(100vh - 200px)" }}>
        <Table
          stickyHeader
          aria-label="patient table"
          sx={{
            "& .MuiTableCell-root": {
              py: isExtraSmallScreen ? 1 : 1.5,
              px: isExtraSmallScreen ? 1 : 2,
            },
            "& .MuiTableCell-head": {
              fontWeight: "bold",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {getVisibleHeaders().map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={getVisibleHeaders().length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No patients found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              patients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                  <TableRow
                    key={patient.id}
                    hover
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {getVisibleHeaders().map((header) => (
                      <TableCell key={`${patient.id}-${header}`}>
                        <Typography variant="body2" noWrap>
                          {renderTableCell(header, patient)}
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
        count={patients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          "& .MuiTablePagination-toolbar": {
            px: isExtraSmallScreen ? 1 : 2,
          },
        }}
      />
    </Paper>
  );
};

export default PatientTable;
