const getInitialValues = ({ showFirstName, showLastName, showName, showPassword, showEmail, showAmount}) => {
  const initialValues = {};
  //  Changed this for now, no longer applies... -> IMPORTANT! Note that these label names are being converted from the prop name using the following logic; set key name accordingly...
  // Logic being used => const labelLower = label.toLowerCase().replace(' ', '-');

  if (showFirstName) {
    initialValues.firstName = '';
  }
  if (showLastName) {
    initialValues.lastName = '';
  }
  if (showName) {
    initialValues.name = '';
  }
  if (showPassword) {
    initialValues.password = '';
  }
  if (showEmail) {
    initialValues.email = '';
  }
  if (showAmount) {
    initialValues['amount'] = '';
  }

  return initialValues;
};

export default getInitialValues;
