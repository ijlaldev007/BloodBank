import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  IconButton,
  Typography,
  Divider,
  Box,
  Paper,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Patient } from '../types/patient';
import { bloodGroups, rhOptions, pakistaniCities } from '../constants/patientConstants';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: Omit<Patient, 'id'>;
  isEditing: boolean;
}

// Custom styled radio button component
const CustomRadioButton = styled(Radio)(({ theme }) => ({
  display: 'none', // Hide the default radio button
}));

// Styled container for the radio option
const RadioOption = styled(Box)(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  padding: '10px 16px',
  borderRadius: '6px',
  border: '1px solid',
  borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textAlign: 'center',
  fontWeight: 500,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

const EnhancedDropdownPaper = (props: React.HTMLAttributes<HTMLElement>) => (
  <Paper
    {...props}
    sx={{
      mt: 0.5,
      borderRadius: 1,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      '& .MuiAutocomplete-listbox': {
        py: 0,
        '& li': {
          fontSize: '0.875rem',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    }}
  />
);

const PatientModal = ({
  isOpen,
  onClose,
  onSave,
  onChange,
  formData,
  isEditing,
}: PatientModalProps) => {
  const handleFieldChange = (name: string, value: string) => {
    onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
          overflow: 'visible',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '1px solid #f0f0f0',
          bgcolor: '#fafafa',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonAddIcon sx={{ color: 'text.primary', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {isEditing ? 'Edit Patient Record' : 'New Patient Registration'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
            <Autocomplete
              fullWidth
              options={bloodGroups}
              value={formData.bloodGroup}
              onChange={(_, newValue) => handleFieldChange('bloodGroup', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Blood Group"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              PaperComponent={EnhancedDropdownPaper}
            />
          </Box>

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ 
              mb: 1.5,
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}>
              Rh Factor
            </FormLabel>
            <RadioGroup
              row
              name="rhFactor"
              value={formData.rhFactor}
              onChange={(e) => handleFieldChange('rhFactor', e.target.value)}
              sx={{ gap: 2 }}
            >
              {rhOptions.map((option: string) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<CustomRadioButton />}
                  label={
                    <RadioOption selected={formData.rhFactor === option}>
                      {option}
                    </RadioOption>
                  }
                  sx={{ margin: 0 }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Autocomplete
              fullWidth
              options={pakistaniCities}
              value={formData.city}
              onChange={(_, newValue) => handleFieldChange('city', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              PaperComponent={EnhancedDropdownPaper}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            fullWidth
            label="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis || ''}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={2}
          />
          
          <TextField
            fullWidth
            label="Treatment Plan"
            name="treatmentPlan"
            value={formData.treatmentPlan || ''}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
        <Button
          onClick={onClose}
          sx={{ px: 3, py: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          sx={{ px: 3, py: 1, borderRadius: 1, bgcolor: '#424242' }}
        >
          {isEditing ? 'Save Changes' : 'Register Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientModal;