import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player'


import styles from '../styles/app.module.scss'
import { PlayerContext } from '../contexts/PlayerContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {//O app é executada em todas as chamadas realiadas

  const [episodeList, setEpisodeList] = useState([]);
  const [currectEpisodeIndex, setCurrentEpisode] = useState(0);

  function play(episode){
    setEpisodeList([episode]);
    setCurrentEpisode(0);
  }


  return (
    <PlayerContext.Provider value={{episodeList, currectEpisodeIndex, play}}>
      <div className={styles.wrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContext.Provider>
  )
}
//Por isso o Header fica aqui, pois em todas as abas o header estará presete
//PlayerContext possibilita que todos os componentes que estao dentro dele,
//tem acesso as informações dele

export default MyApp
