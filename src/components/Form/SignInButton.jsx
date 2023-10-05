import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import UserContext from '../../contexts/UserContext';
import getCurrentUser from '../../utils/getCurrentUser';

const SignInButton = ({ title }) => {
  const context = useContext(UserContext);

  if (context) title = getCurrentUser(context).email;
  return (
    <Button variant={'light'} href="#/SignIn/">
      {title}
    </Button>
  );
};

export default SignInButton;
