import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styles from './PaymentExamples.module.css';
import CardHeader from '@mui/material/CardHeader';

export default function PaymentExamples() {
  return (
    <>
      <div className={styles.cardContainer}>
        <Card className={styles.card}>
          <CardContent>
            <CardHeader
              title="Sample dummy card numbers"
              subheader="(Use any 3-digit code end exp date)"
            />

            <div>
              <ul>
                <li>
                  <strong>Visa: </strong>4242-4242-4242-4242
                </li>
              </ul>
              <ul>
                <li>
                  <strong>Mastercard: </strong>5555-5555-5555-4444
                </li>
              </ul>
              <ul>
                <li>
                  <strong>American Express: </strong> 3782-822463-10005
                </li>
              </ul>
              <ul>
                <li>
                  <strong>Discover: </strong>6011-1111-1111-1117
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
