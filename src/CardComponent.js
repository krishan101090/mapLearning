import React from "react";
import styles from "./CardComponent.module.scss";

// Configuration
const cardConfig = [
  {
    title: "Sports Expenditure",
    subtitle: "2.4B Usd",
  },
  {
    title: "Investment in Sport Sector",
    subtitle: "3B Usd",
  },
  {
    title: "Economic Impact",
    subtitle: "1B Usd",
  },
  {
    title: "Sports Contribution to GDP",
    subtitle: "10 %",
  },
];

const CardComponent = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>Tracker</div>
      <div className={styles.cardWrapper}>
        {cardConfig.map((item, index) => (
          <div key={index} className={styles.subCard}>
            <div className={styles.subCardTitle}>{item.title}</div>
            <div className={styles.subCardSubtitle}>{item.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
