import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import FormElement from './FormElement';
import { convertToCurrency } from '../../libs/formatter';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Link from 'next/link';
import styles from './Form.module.css';
import FormSetter from './FormSetter';

function Form(props) {
  const formSetter = new FormSetter(props);
  const validationSchema = Yup.object(formSetter.validationSchema());

  const isDisabled = (values) => {
    let disabled = false;
    Object.keys(values).forEach((value) =>
      values[value].length === 0 ? (disabled = true) : null
    );
    return disabled;
  };

  return (
    <Formik
      initialValues={formSetter.initialValues()}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        props.handler(values);
        resetForm();
      }}
    >
      {(formik) => (
        <FormikForm onSubmit={formik.handleSubmit} noValidate>
          {props.showFirstName && (
            <FormElement
              id="firstName"
              formik={formik}
              label="First Name"
              type="text"
            />
          )}

          {props.showLastName && (
            <FormElement
              id="lastName"
              formik={formik}
              label="Last Name"
              type="text"
            />
          )}

          {props.showEmail && (
            <FormElement
              id="email"
              formik={formik}
              label="Email"
              type="email"
            />
          )}

          {props.showPassword && (
            <FormElement
              id="password"
              formik={formik}
              label="Password"
              type="password"
            />
          )}

          {props.showAmount && (
            <>
              <div className="balance-display">
                <h2>Total</h2>
                <h3>{convertToCurrency(1000)}</h3>
              </div>
              <FormElement formik={formik} label={props.transferType} />
            </>
          )}
          <div className="btn-container">
            <CardActions className={styles.cardFooter}>
              <Button
                variant="contained"
                className="btn btn-dark"
                disabled={isDisabled(formik.values)}
                type="submit"
              >
                {props.footer?.submitButton.buttonText
                  ? props.footer.submitButton.buttonText
                  : 'Submit'}
              </Button>
              {props.footer?.link ? (
                <Link className="footerLink" href={props.footer.link.url}>
                  {props.footer.link.text}
                </Link>
              ) : null}
            </CardActions>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
}

export default Form;
