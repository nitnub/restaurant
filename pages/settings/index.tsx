import SettingsTabs from '@/components/Settings/SettingsTabs';
import Container from '@mui/material/Container';
import Head from 'next/head';

export default function settings() {
  return (
    <Container>
      <Head>
        <title>Restaurant App | Settings</title>
      </Head>
      <SettingsTabs />
    </Container>
  );
}
