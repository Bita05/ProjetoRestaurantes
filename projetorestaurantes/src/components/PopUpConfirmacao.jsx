import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ModalConfirmacao = ({ open, onClose, onConfirm, title, mensagem }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirmar Ação'}</DialogTitle>
      <DialogContent>
        <Typography>{mensagem || 'Tem a certeza que deseja continuar?'}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Sim</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirmacao;
