import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss'
import Image from 'next/image'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  //-cria referencia para elemento html afim de manipula-los
  //-boa pratica é iniciar ela como null
  //-htmlAudioElemente fornece uma inteligencia por meio do typescript para saber
  //quais metodos existem dentro
  const { 
    episodeList, 
    currectEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState
  }  = useContext(PlayerContext)

  useEffect(() =>{// Realiza ação apartir do acontecimento de outra ação
    if(!audioRef.current){//valor nao fica diretamente tenho da ref
      return ;
    }
    if(isPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }
  },[isPlaying])

  const episode = episodeList[currectEpisodeIndex]

  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className = {styles.currentEpisode}>
          <Image
            width = {592}
            height = {592}
            src = {episode.thumbnail}
            objectFit = "cover"
          />
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
         <span>00:00</span> 
          <div className={styles.slider}>
            {episode ? (
              <Slider
              trackStyle ={{backgroundColor:'#04d361'}}//Altera a cor do progresso
              railStyle ={{backgroundColor:' #9f75ff'}}//Altera cor da barra sem progresso
              handleStyle ={{borderColor:'#04d361', borderWidth:4}}//cor da bolinha de progresso
              />
            ) :(
              <div className={styles.emptySlider}/>
            )}
          </div>
          <span>00:00</span> 
        </div>

        {episode &&(
          <audio
          src={episode.url}
          ref={audioRef}
          autoPlay
          onPlay={()=>setPlayingState(true)}
          onPause = {()=>setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled ={!episode}>
             <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled ={!episode}>
             <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button 
          type="button" 
          className={styles.playButton} 
          disabled ={!episode}
          onClick={togglePlay}>
             {isPlaying 
              ? <img src="/pause.svg" alt="Tocar"/>
              :<img src="/play.svg" alt="Tocar"/>}
          </button>
          <button type="button" disabled ={!episode}>
             <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button type="button" disabled ={!episode}>
             <img src="/repeat.svg" alt="Repetir"/>
          </button>

        </div>
      </footer>
      
    </div>
  );
}