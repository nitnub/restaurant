import { Field, ErrorMessage } from 'formik';
import TextField from '@mui/material/TextField';
import styles from './Form.module.css';
function FormElement({ formik, label, type, id }) {
  // const labelLower = label.toLowerCase().replace(' ', ''); // as needed...

  const name = label.charAt(0).toLowerCase() + label.replace(' ', '').slice(1);

  return (
    <>
      <div className="form-section">
        <TextField
          className="form-control"
          id={id}
          name={id}
          label={label}
          value={formik.values[id]} //
          onChange={formik.handleChange} //
          error={formik.touched[name] && Boolean(formik.errors[name])} //
          helperText={formik.touched[id] && formik.errors[id]} //
          type={type}
          variant="standard"
          min="0" // Hold for now in case of need for a dynamic num form field
        />
      </div>
    </>
  );
}

export default FormElement;
