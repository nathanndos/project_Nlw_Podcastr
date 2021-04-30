import { createContext} from 'react';

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