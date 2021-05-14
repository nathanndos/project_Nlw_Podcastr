import { useEffect, useRef, useState } from 'react';
import {usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss'
import Image from 'next/image'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurantionToTimeString } from '../../utils/convertDurationToTimeString'

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  //-cria referencia para elemento html afim de manipula-los
  //-boa pratica é iniciar ela como null
  //-htmlAudioElemente fornece uma inteligencia por meio do typescript para saber
  //quais metodos existem dentro
  const [ progress, setProgress] = useState(0)

  const { 
    episodeList, 
    currectEpisodeIndex, 
    isPlaying, 
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState
  }  = usePlayer()

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

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate',() =>{
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }
  function handleSeek(amount:number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else{
      clearPlayerState();
    }
  }

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
          <span>{convertDurantionToTimeString(progress)}</span>  
          <div className={styles.slider}>
            {episode ? (
              <Slider
              max={episode.duration}
              value={progress}
              onChange={handleSeek}
              trackStyle ={{backgroundColor:'#04d361'}}//Altera a cor do progresso
              railStyle ={{backgroundColor:' #9f75ff'}}//Altera cor da barra sem progresso
              handleStyle ={{borderColor:'#04d361', borderWidth:4}}//cor da bolinha de progresso
              />
            ) :(
              <div className={styles.emptySlider}/>
            )}
          </div>
          <span>{convertDurantionToTimeString(episode?.duration?? 0)}</span> 
        </div>

        {episode &&(
          <audio
          src={episode.url}
          ref={audioRef}
          autoPlay
          onEnded={handleEpisodeEnded}
          loop={isLooping}
          onPlay={()=>setPlayingState(true)}
          onPause = {()=>setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" 
            disabled ={!episode ||episodeList.length ==1} 
            onClick={toggleShuffle} 
            className={isLooping ? styles.isActive: ''}>
             <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled ={!episode || !hasPrevious} onClick={playPrevious}>
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
          <button type="button" disabled ={!episode || !hasNext} onClick={playNext}>
             <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button type="button" disabled ={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive: ''}>
             <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}