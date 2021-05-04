import { createContext, useState, ReactNode} from 'react';

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
  play: (episode: Episode) => void;
  setPlayingState:(state: boolean) =>void;
  togglePlay:() =>void;
}
export const PlayerContext  = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children : ReactNode;
}

export function PlayerContextProvider({children}:PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currectEpisodeIndex, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisode(0);
    setIsPlaying(true);
  }
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state:boolean){
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider 
      value={{episodeList, 
      currectEpisodeIndex, 
      play, 
      isPlaying, 
      togglePlay, 
      setPlayingState}}>
      {children}
    </PlayerContext.Provider>
    )
}