import {GetStaticProps} from 'next'
import Image from 'next/image';
//Possibilita redimensionar a imagem, a partir de largura e altura
import Link from 'next/link'
//Auxilia o react no SPA, fazendo com que seja carregado na tela somente
//itens novos, e não os ja existentes na tela
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
//Importa o idioma pt-br
import { api } from '../services/api'
import { convertDurantionToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

type Episode = { //Criando typescript ->Funciona como interface
  id: string;
  title: string;
  members:string;
  thumbnail:string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}
type HomeProps = {
  lastEpisodes: Episode[];
  allEpisodes: Episode[]
}

export default function Home({lastEpisodes, allEpisodes}: HomeProps) {

  //useEffect()quando algo da aplicação acontecer, um evento será inciado->1ºoq/2ºqnd(array)

  return (
    <div className ={styles.homePage}>
      <section className={styles.lastEpisodes}> 
        <h2>Últimos podcasts</h2>
        <ul>
          {lastEpisodes.map(episode =>{
            return(
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                  />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>

                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}

        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={5} >
          <thead> 
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode =>{
              return (
                <tr key ={episode.id}>
                  <td style={{width:72}}>
                    <Image
                    width={120}
                    height = {120}
                    src = {episode.thumbnail}
                    objectFit = "cover"
                    />
                  </td>
                  <td>
                    <Link href ={`/episodes/${episode.id}`} >
                      <a >{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width:90}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt ="Tocar episodio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </section>
    </div>
  )
}

//**Section** é parecido com a div, no entanto o section cria uma seção generica, onde
//todos itens seguem o mesmo tema, além de receberem um titulo

//**Key **O argumento sempre deve ser passado quando é utilizado o map, pois caso
//seja realizado alguma alteração das informações no react, ele irá recriar tudo
//do zero

//É interessante carregar a imagem no Image 3x maior para nao ficar pixelada
// **ObjectFit** é umas das propriedades do Image, e possui varias tipos
// - Conver: Cobre o espaço destinado à imagem sem distorcer
// - Contain: Nao distorce, mas diminui o tamanho da imagem para caber no esçaço

//**Thead** é uma tag do table que agrupa o conteceu do header

export const getStaticProps: GetStaticProps = async () =>{
  //Depois que foi trocado fetch pelo axios, o codigo ficou mais limpo e mais facil
  //de entender. Possibilitando passar config externamente
  const { data } =  await api.get('episodes',{
    params:{
      _limit:12, //limita a quantidade de buscas
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

  const lastEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2,episodes.length)
  return {
    props:{
      lastEpisodes,
      allEpisodes
    },
    revalidate:60*60*8, //tempo para nova requisição
  }
}