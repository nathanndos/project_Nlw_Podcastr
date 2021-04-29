import { createContext} from 'react';

//Criando uma tipagem das informações que desejam ser salvas no contexto

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currectEpisodeIndex: 0,
}
export const PlayerContext  = createContext({} as PlayerContextData)