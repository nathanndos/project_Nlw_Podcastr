import { createContext, useState, ReactNode, useContext} from 'react';

//Criando uma tipagem das informações que desejam ser salvas no contexto

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currectEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList:(list: Episode[], index: number) =>void;
  setPlayingState:(state: boolean) =>void;
  togglePlay:() =>void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext:()=> void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}
export const PlayerContext  = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children : ReactNode;
}//reactNode ->qualkquer conteudo que o react aceitaria

export function PlayerContextProvider({children}:PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currectEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }
  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state:boolean){
    setIsPlaying(state);
  }

  const hasPrevious = currectEpisodeIndex >0;
  const hasNext = currectEpisodeIndex + 1 < episodeList.length;

  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currectEpisodeIndex + 1);
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currectEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider 
      value={{episodeList, 
      currectEpisodeIndex, 
      play, 
      playList,
      playNext,
      playPrevious,
      isPlaying, 
      isLooping,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      isShuffling,
      setPlayingState,
      hasNext,
      hasPrevious}}
      >
        {{children}}
    </PlayerContext.Provider>
    )
}

export const usePlayer = () =>{
  return useContext(PlayerContext)
}