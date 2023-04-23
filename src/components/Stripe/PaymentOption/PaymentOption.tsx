import Image from 'next/image';
import styles from './PaymentOption.module.css';

export default function PaymentOption({ paymentProps }) {
  const { brand, expMonth, expYear, last4 } = paymentProps;

  let imgPath: string;
  let height: number;
  let width: number;

  if (brand === 'visa') {
    imgPath = '/images/card-logos/visa.card.png';
    height = 20;
    width = 60;
  }
  
  if (brand === 'mastercard') {
    imgPath = '/images/card-logos/mc.card.svg';
    height = 40;
    width = 60;
  }
  if (brand === 'amex') {
    imgPath = '/images/card-logos/ae.card.svg';
    height = 40;
    width = 60;
  }

    if (brand === 'discover') {
    imgPath = '/images/card-logos/d.card.jpg';
    height = 40;
    width = 60;
  }
  return (
    <div className={styles.paymentContainer}>
      <Image src={imgPath} width={width} height={height} alt={imgPath} />
      <div className={styles.cardDetails}>
        <div className={styles.lastFour}>...{last4}</div>
        <div className={styles.expDate}>{`exp ${expMonth}/${expYear}`}</div>
      </div>
    </div>
  );
}
