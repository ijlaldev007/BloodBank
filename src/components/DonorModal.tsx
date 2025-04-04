import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  bloodGroups,
  rhOptions,
  eligibilityOptions,
  pakistaniCities,
} from '../constants/donorConstants';
import {
  RadioOption,
  SectionHeader,
  DialogPaper,
  ActionButton,
} from './styled/DonorStyled';

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
    name: string;
    bloodGroup: string;
    rhFactor: string;
    lastDonationDate: string;
    ongoingMedications: string;
    chronicDiseases: string;
    weight: string;
    hemoglobinLevel: string;
    allergies: string;
    eligible: string;
    city: string;
    contact: string;
  };
  isEditing: boolean;
}

// Flex container for two-column layout
const FlexTwoColumn = (props: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>{props.children}</Box>
);

// Field wrappers to control width
const HalfWidthField = (props: { children: React.ReactNode }) => (
  <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>{props.children}</Box>
);
const FullWidthField = (props: { children: React.ReactNode }) => (
  <Box sx={{ flex: '1 1 100%' }}>{props.children}</Box>
);

const DonorModal: React.FC<DonorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onChange,
  formData,
  isEditing,
}) => {
  const handleFieldChange = (name: string, value: string) => {
    onChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '1px solid #f0f0f0',
          bgcolor: '#fafafa',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
          <PersonAddIcon sx={{ color: 'text.primary', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {isEditing ? 'Edit Donor Information' : 'Register New Donor'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Personal Details */}
        <SectionHeader>Personal Details</SectionHeader>
        <FlexTwoColumn>
          <FullWidthField>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </FullWidthField>
          <HalfWidthField>
            <Autocomplete
              fullWidth
              options={bloodGroups}
              value={formData.bloodGroup}
              onChange={(_, newValue) =>
                handleFieldChange('bloodGroup', newValue || '')
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Blood Group"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </HalfWidthField>
          <HalfWidthField>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
                Rh Factor
              </FormLabel>
              <RadioGroup
                row
                name="rhFactor"
                value={formData.rhFactor}
                onChange={(e) => handleFieldChange('rhFactor', e.target.value)}
                sx={{ gap: 1 }}
              >
                {rhOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <RadioOption selected={formData.rhFactor === option}>
                        {option}
                      </RadioOption>
                    }
                    sx={{ m: 0 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </HalfWidthField>
        </FlexTwoColumn>

        {/* Medical Information */}
        <SectionHeader sx={{ mt: 3 }}>Medical Information</SectionHeader>
        <FlexTwoColumn>
          <HalfWidthField>
            <TextField
              label="Last Donation Date"
              name="lastDonationDate"
              type="date"
              value={formData.lastDonationDate}
              onChange={onChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </HalfWidthField>
          <HalfWidthField>
            <TextField
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={onChange}
              variant="outlined"
              size="small"
            />
          </HalfWidthField>
          <HalfWidthField>
            <TextField
              label="Hemoglobin Level (g/dL)"
              name="hemoglobinLevel"
              type="number"
              value={formData.hemoglobinLevel}
              onChange={onChange}
              variant="outlined"
              size="small"
            />
          </HalfWidthField>
          <HalfWidthField>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
                Eligibility Status
              </FormLabel>
              <RadioGroup
                row
                name="eligible"
                value={formData.eligible}
                onChange={(e) => handleFieldChange('eligible', e.target.value)}
                sx={{ gap: 1 }}
              >
                {eligibilityOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <RadioOption selected={formData.eligible === option}>
                        {option}
                      </RadioOption>
                    }
                    sx={{ m: 0 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </HalfWidthField>
          <FullWidthField>
            <TextField
              fullWidth
              label="Ongoing Medications"
              name="ongoingMedications"
              value={formData.ongoingMedications}
              onChange={onChange}
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />
          </FullWidthField>
          <HalfWidthField>
            <TextField
              fullWidth
              label="Chronic Diseases"
              name="chronicDiseases"
              value={formData.chronicDiseases}
              onChange={onChange}
              variant="outlined"
              size="small"
            />
          </HalfWidthField>
          <HalfWidthField>
            <TextField
              fullWidth
              label="Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={onChange}
              variant="outlined"
              size="small"
            />
          </HalfWidthField>
        </FlexTwoColumn>

        {/* Contact Details */}
        <SectionHeader sx={{ mt: 3 }}>Contact Details</SectionHeader>
        <FlexTwoColumn>
          <HalfWidthField>
            <Autocomplete
              fullWidth
              options={pakistaniCities}
              value={formData.city}
              onChange={(_, newValue) => handleFieldChange('city', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </HalfWidthField>
          <HalfWidthField>
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={onChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </HalfWidthField>
        </FlexTwoColumn>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fafafa' }}>
        <ActionButton onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </ActionButton>
        <ActionButton onClick={onSave} variant="contained" color={isEditing ? 'primary' : 'success'}>
          {isEditing ? 'Update Donor' : 'Register Now'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};

export default DonorModal;
