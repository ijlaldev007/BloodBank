import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Paper } from '@mui/material';

export const RadioOption = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<{ selected: boolean }>(({ theme, selected }) => ({
  padding: '6px 12px',
  borderRadius: '20px',
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.grey[400]}`,
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}));

export const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1.5),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  marginBottom: theme.spacing(2)
}));

export const DialogPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px !important',
  boxShadow: theme.shadows[5],
  overflow: 'visible',
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 2.5),
  textTransform: 'none',
  fontWeight: 500,
}));