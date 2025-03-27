import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Button, Paper } from "@mui/material";
import { Donor } from "../types/donor"; // Import the Donor type

interface DonorTableProps {
  donors: Donor[];
  handleDeleteDonor: (id: string) => void;
  handleEditDonor: (donor: Donor) => void;
}

const TABLE_HEADERS = [
  "Name",
  "Blood Group",
  "Rh Factor",
  "Last Donation Date",
  "Medications",
  "Chronic Diseases",
  "Weight (kg)",
  "Hemoglobin (g/dL)",
  "Allergies",
  "Eligible (Yes/No)",
  "City",
  "Contact",
  "Actions",
];

const DonorTable: React.FC<DonorTableProps> = ({ donors, handleDeleteDonor, handleEditDonor }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} className="h-full w-full overflow-scroll shadow-md">
      <Table sx={{ minWidth: 650 }} aria-label="donor table">
        <TableHead>
          <TableRow>
            {TABLE_HEADERS.map((head) => (
              <TableCell key={head}>
                <Typography variant="body1" color="textSecondary">
                  {head}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {donors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TABLE_HEADERS.length} align="center">
                <Typography variant="body2" color="textSecondary">
                  No donors found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            donors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((donor) => (
              <TableRow key={donor.id}>
                <TableCell>{donor.name}</TableCell>
                <TableCell>{donor.bloodGroup}</TableCell>
                <TableCell>{donor.rhFactor}</TableCell>
                <TableCell>{donor.lastDonationDate}</TableCell>
                <TableCell>{donor.ongoingMedications}</TableCell>
                <TableCell>{donor.chronicDiseases}</TableCell>
                <TableCell>{donor.weight}</TableCell>
                <TableCell>{donor.hemoglobinLevel}</TableCell>
                <TableCell>{donor.allergies}</TableCell>
                <TableCell>{donor.eligible}</TableCell>
                <TableCell>{donor.city}</TableCell>
                <TableCell>{donor.contact}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditDonor(donor)}
                    variant="contained"
                    color="warning"
                    size="small"
                    style={{ marginRight: 10 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteDonor(donor.id)}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={donors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default DonorTable;
