import styles from './styles.module.scss'

export function Header(){
  return(
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="podcastr"/>

      <p> O melhor para você ouvir, sempre</p>

      <span>Sext, 7 Março</span>

    </header>
    
  );
}