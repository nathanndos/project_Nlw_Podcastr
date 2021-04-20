import format from 'date-fns/format' // possibilita formatação da date
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

export function Header(){
  /*const currentDate = new Date().toLocaleDateString
      Cria uma instancia do objeto date e converte ele para formato Br
  */
      const currentDate = format(new Date, 'EEEEEE, d MMMM')

      // documentação https://date-fns.org/docs/Getting-Started

  return(
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="podcastr"/>

      <p> O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>

    </header>
    
  );
}