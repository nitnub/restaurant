import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styles from './PaymentExamples.module.css';
import CardHeader from '@mui/material/CardHeader';

export default function PaymentExamples() {
  const cardList = [
    { name: 'Visa', number: '4242-4242-4242-4242' },
    { name: 'Mastercard', number: '5555-5555-5555-4444' },
    { name: 'American Express', number: '3782-822463-10005' },
    { name: 'Discover', number: '6011-1111-1111-1117' },
  ];

  const getCardListItem = (card: string, number: string) => {
    return (
      <li key={number} style={{ marginBottom: '12px' }}>
        <strong>{card}: </strong>
        {number}
      </li>
    );
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <Card className={styles.card}>
          <CardContent>
            <CardHeader
              title="Sample dummy card numbers"
              subheader="(Use any 3-digit code end exp date)"
            />
            <ul>
              {cardList.map((card) => getCardListItem(card.name, card.number))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
