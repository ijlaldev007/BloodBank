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
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  bloodGroups,
  rhOptions,
  pakistaniCities,
} from '../constants/donorConstants';
import {
  RadioOption,
  SectionHeader,
  ActionButton,
} from './styled/DonorStyled';

import { toast } from 'react-toastify';

interface DonorFormData {
  name: string;
  bloodGroup: string;
  rhFactor: string;
  lastDonationDate: string;
  ongoingMedications: string;
  chronicDiseases: string;
  weight: string;
  hemoglobinLevel: string;
  allergies: string;
  city: string;
  contact: string;
  eligible: string;
}

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: DonorFormData) => Promise<void>;
  isEditing: boolean;
  initialValues: DonorFormData;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  
  bloodGroup: Yup.string()
    .required('Blood group is required')
    .oneOf(bloodGroups, 'Invalid blood group'),
  
  rhFactor: Yup.string()
    .required('Rh factor is required')
    .oneOf(rhOptions, 'Invalid Rh factor'),
  
  lastDonationDate: Yup.date()
    .required('Last donation date is required')
    .max(new Date(), 'Date cannot be in the future')
    .typeError('Invalid date format'),
  
  weight: Yup.number()
    .required('Weight is required')
    .min(40, 'Minimum weight is 40 kg')
    .max(200, 'Maximum weight is 200 kg')
    .typeError('Must be a valid number'),
  
  hemoglobinLevel: Yup.number()
    .required('Hemoglobin level is required')
    .min(12.5, 'Minimum 12.5 g/dL for donation')
    .max(20, 'Maximum 20 g/dL')
    .typeError('Must be a valid number'),
  
  city: Yup.string()
    .required('City is required')
    .oneOf(pakistaniCities, 'Invalid city selection'),
  
  contact: Yup.string()
    .required('Contact number is required')
    .matches(/^03\d{9}$/, 'Invalid format. Use 03XXXXXXXXX')
    .length(11, 'Must be 11 digits'),
  
  ongoingMedications: Yup.string()
    .max(200, 'Cannot exceed 200 characters'),
  
  chronicDiseases: Yup.string()
    .max(100, 'Cannot exceed 100 characters'),
  
  allergies: Yup.string()
    .max(100, 'Cannot exceed 100 characters'),
});

const FlexTwoColumn = (props: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>{props.children}</Box>
);

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
  isEditing,
  initialValues,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSave(values);
        toast.success('Donor saved successfully!');
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Could not save donor. Please try again.');
      }
    },
  });

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        onClose();
        formik.resetForm();
      }}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            borderBottom: '1px solid #f0f0f0',
            bgcolor: '#fafafa',
            flexShrink: 0,
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

        <DialogContent sx={{
          p: 3,
          overflowY: 'auto',
          flex: 1,
        }}>
          <SectionHeader>Personal Details</SectionHeader>
          <FlexTwoColumn>
            <FullWidthField>
              <TextField
                fullWidth
                label="Full Name"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                size="small"
              />
            </FullWidthField>
            <HalfWidthField>
              <Autocomplete
                fullWidth
                options={bloodGroups}
                value={formik.values.bloodGroup}
                onChange={(_, value) => formik.setFieldValue('bloodGroup', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Blood Group"
                    error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
                    helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </HalfWidthField>
            <HalfWidthField>
              <FormControl component="fieldset" fullWidth error={formik.touched.rhFactor && Boolean(formik.errors.rhFactor)}>
                <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  Rh Factor
                </FormLabel>
                <RadioGroup
                  row
                  {...formik.getFieldProps('rhFactor')}
                  sx={{ gap: 1 }}
                >
                  {rhOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <RadioOption selected={formik.values.rhFactor === option}>
                          {option}
                        </RadioOption>
                      }
                      sx={{ m: 0 }}
                    />
                  ))}
                </RadioGroup>
                {formik.touched.rhFactor && formik.errors.rhFactor && (
                  <Typography variant="caption" color="error">
                    {formik.errors.rhFactor}
                  </Typography>
                )}
              </FormControl>
            </HalfWidthField>
          </FlexTwoColumn>

          <SectionHeader sx={{ mt: 3 }}>Medical Information</SectionHeader>
          <FlexTwoColumn>
            <HalfWidthField>
              <TextField
                fullWidth
                label="Last Donation Date"
                type="date"
                {...formik.getFieldProps('lastDonationDate')}
                error={formik.touched.lastDonationDate && Boolean(formik.errors.lastDonationDate)}
                helperText={formik.touched.lastDonationDate && formik.errors.lastDonationDate}
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </HalfWidthField>
            <HalfWidthField>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                {...formik.getFieldProps('weight')}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
                variant="outlined"
                size="small"
                inputProps={{ step: "0.1", min: 40, max: 200 }}
              />
            </HalfWidthField>
            <HalfWidthField>
              <TextField
                fullWidth
                label="Hemoglobin (g/dL)"
                type="number"
                {...formik.getFieldProps('hemoglobinLevel')}
                error={formik.touched.hemoglobinLevel && Boolean(formik.errors.hemoglobinLevel)}
                helperText={formik.touched.hemoglobinLevel && formik.errors.hemoglobinLevel}
                variant="outlined"
                size="small"
                inputProps={{ step: "0.1", min: 12.5, max: 20 }}
              />
            </HalfWidthField>
            <FullWidthField>
              <TextField
                fullWidth
                label="Ongoing Medications"
                {...formik.getFieldProps('ongoingMedications')}
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
                {...formik.getFieldProps('chronicDiseases')}
                variant="outlined"
                size="small"
              />
            </HalfWidthField>
            <HalfWidthField>
              <TextField
                fullWidth
                label="Allergies"
                {...formik.getFieldProps('allergies')}
                variant="outlined"
                size="small"
              />
            </HalfWidthField>
          </FlexTwoColumn>

          <SectionHeader sx={{ mt: 3 }}>Contact Details</SectionHeader>
          <FlexTwoColumn>
            <HalfWidthField>
              <Autocomplete
                fullWidth
                options={pakistaniCities}
                value={formik.values.city}
                onChange={(_, value) => formik.setFieldValue('city', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </HalfWidthField>
            <HalfWidthField>
              <TextField
                fullWidth
                label="Contact Number"
                type="tel"
                {...formik.getFieldProps('contact')}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
                variant="outlined"
                size="small"
                placeholder="03XXXXXXXXX"
              />
            </HalfWidthField>
          </FlexTwoColumn>
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: '#fafafa',
          flexShrink: 0,
        }}>
          <ActionButton onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </ActionButton>
          <ActionButton
            type="submit"
            variant="contained"
            color={isEditing ? 'primary' : 'success'}
            disabled={formik.isSubmitting || !formik.isValid}
            
          >
            {isEditing ? 'Update Donor' : 'Register Now'}
          </ActionButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DonorModal;