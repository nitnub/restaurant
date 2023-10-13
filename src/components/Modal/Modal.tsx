import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from './Modal.module.css';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AccountCreationModal(props) {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {props.body}
            Account {<strong>{props.email}</strong>} has been created! You can
            now place an order from the shopping cart. Any items that were in
            your guest cart have been moved over to your new account for you.
            Lastly, don&apos;t forget to add a dummy credit card number under
            &ldquo;Settings&rdquo; so that payment IDs can be generated through
            Stripe.
          </Typography>
          <br />
          <div className={styles.button}>
            <Button onClick={props.handleClose}>{props.buttonText}</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
