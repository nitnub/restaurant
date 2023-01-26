import styles from '@/components/Layout.module.css';
import CartDrawer from './cart/CartDrawer';
import Container from '@mui/material/Container';
const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Container className={styles.container} maxWidth="lg">
        {children}
      </Container>
    </>
  );
};

export default Layout;
