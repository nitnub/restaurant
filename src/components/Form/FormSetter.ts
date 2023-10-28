import * as Yup from 'yup';
import { RequiredNumberSchema } from 'yup/lib/number';
import { AnyObject } from 'yup/lib/types';

interface FormDisplayProps {
  showFirstName: boolean;
  showLastName: boolean;
  showName: boolean;
  showPassword: boolean;
  showEmail: boolean;
  showAmount: boolean;
}

interface FormDefaultValues {
  firstName?: string;
  lastName?: string;
  name?: string;
  password?: string;
  email?: string;
}

interface FormSchema {
  firstName?: Yup.StringSchema<string, AnyObject, string>;
  lastName?: Yup.StringSchema<string, AnyObject, string>;
  name?: Yup.StringSchema<string, AnyObject, string>;
  password?: Yup.StringSchema<string, AnyObject, string>;
  email?: Yup.StringSchema<string, AnyObject, string>;
  amount?: RequiredNumberSchema<number, AnyObject>;
}

export default class FormSetter {
  private showFirstName: boolean;
  private showLastName: boolean;
  private showName: boolean;
  private showPassword: boolean;
  private showEmail: boolean;
  private showAmount: boolean;

  constructor(settings: FormDisplayProps) {
    this.showFirstName = settings.showFirstName;
    this.showLastName = settings.showLastName;
    this.showName = settings.showName;
    this.showPassword = settings.showPassword;
    this.showEmail = settings.showEmail;
    this.showAmount = settings.showAmount;
  }

  initialValues() {
    const initialValues: FormDefaultValues = {};

    if (this.showFirstName) {
      initialValues.firstName = '';
    }
    if (this.showLastName) {
      initialValues.lastName = '';
    }
    if (this.showName) {
      initialValues.name = '';
    }
    if (this.showPassword) {
      initialValues.password = '';
    }
    if (this.showEmail) {
      initialValues.email = '';
    }
    if (this.showAmount) {
      initialValues['amount'] = '';
    }

    return initialValues;
  }

  validationSchema() {
    let schema: FormSchema = {};

    if (this.showFirstName) {
      schema.firstName = Yup.string()
        .required('Please enter a First Name')
        .min(3, 'Name must be at least 3 characters long');
    }

    if (this.showLastName) {
      schema.lastName = Yup.string()
        .required('Please enter a Last Name')
        .min(3, 'Name must be at least 3 characters long');
    }

    if (this.showName) {
      schema.name = Yup.string()
        .required('Please enter a Name')
        .min(3, 'Name must be at least 3 characters long');
    }

    if (this.showPassword) {
      schema.password = Yup.string()
        .required()
        .matches(/^.{8,}$/, `Password must be at least 8 characters long`);
    }

    if (this.showEmail) {
      schema.email = Yup.string()
        .required()
        .email('Please enter a valid email address');
    }

    if (this.showAmount) {
      schema.amount = Yup.number()
        .typeError('Please enter a non-negative numeric value')
        .required('Please enter an amount')
        .positive('Amount must be greater than zero')
        .integer('Amount must be a whole number greater than zero');
    }
    return schema;
  }
}
