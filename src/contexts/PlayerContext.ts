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
  play: (episode: Episode) => void;
}
export const PlayerContext  = createContext({} as PlayerContextData)