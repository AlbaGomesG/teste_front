import React from "react";
import styles from "../styles/CountryCard.module.css";
import Image from "next/image";

export default function CountryCard({ country, onClick, onCardClick }) {
  return (
    <div 
    className={styles.card}
    onClick={() => {
      if (onCardClick) onCardClick(country);
      if (onClick) onClick();
    }}>
      <Image 
      src={country.flags.png}
      alt={`Bandeira de ${country.translations.por.common}`}
      className={styles.flag}
      width={100}
      height={60}
      />
      <h3 className={styles.name}>{country.translations.por.common}</h3>
    </div>
  );
}
