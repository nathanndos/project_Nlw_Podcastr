import {GetStaticProps} from 'next'
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurantionToTimeString } from '../utils/convertDurationToTimeString'

type Episode = { //Criando typescript ->Funciona como interface
  id: string;
  title: string;
  members:string;
}
type HomeProps = {
  episodes: Array<Episode>;
}

export default function Home(props: HomeProps) {
  //useEffect()quando algo da aplicação acontecer, um evento será inciado->1ºoq/2ºqnd(array)
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () =>{
  //Depois que foi trocado fetch pelo axios, o codigo ficou mais limpo e mais facil
  //de entender. Possibilitando passar config externamente
  const { data } =  await api.get('episodes',{
    params:{
      _limit:12,
      _sort:'published_at',
      _order:'desc'
    }
  })
  const episodes = data.map(episode=>{
    return{
      id:episode.id,
      title:episode.title,
      thumbnail:episode.thumbnail,
      members:episode.members,
      publishedAt: format(parseISO(episode.published_at),'d MMM y', {locale: ptBR}),//transforma string em date
      duration: Number(episode.file.duration),
      durationAsString: convertDurantionToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,

    };
  })

  //fetch API dentro do browser
  //Cria 'peryparm' (Nao sei como escreve) Limita o carregamento para 12 itens, ordena por data de publicação
  //E na ordem decrescente

  return {
    props:{
      episodes,
    },
    revalidate:60*60*8, //tempo para nova requisição
  }
}