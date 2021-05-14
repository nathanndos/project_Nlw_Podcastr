import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import ptBR from 'date-fns/locale/pt-BR';
import {format, parseISO} from 'date-fns';
import {useRouter} from 'next/router';
import { api } from '../../services/api';
import Link from 'next/link'
import { convertDurantionToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { useContext } from 'react';
import {usePlayer } from '../../contexts/PlayerContext';
//Este arquivo possibilita criar rotas com o nome dos eps como id
//

type Episode = {
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

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({episode}: EpisodeProps){
  const { play } = usePlayer()

  return(
    <div className ={styles.episode}>
    <Head>
      <title>{episode.title}</title>
    </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type = "button">
            <img src="/arrow-left.svg" alt= "Voltar"/>
          </button>
        </Link>
        <Image
          width={700}
          height = {160}
          src = {episode.thumbnail}
          objectFit = "cover"
        />
        <button type = "button" onClick={() =>play(episode)}>
        <img src = "/play.svg" alt = "Tocar episodio"/>
      </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div
        className = {styles.description}
        dangerouslySetInnerHTML ={{__html:episode.description}}
        //É utilizado isso pois ele não exibe texto html, é uma forma de segurança
        //que tenta previnir a execução de script dentros do texto, no caso conteudo malefico
        // Dangerous força o react a executar as tags no texto
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () =>{
  const { data } = await api.get('episodes',{
    params:{
      _limit:2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const paths = data.map(episode =>{
    return {
      params:{
        slug: episode.id
      }
    }
  })
  return{
    paths,
    fallback: 'blocking'  
  }
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
      id:data.id,
      title:data.title,
      thumbnail:data.thumbnail,
      members:data.members,
      publishedAt: format(parseISO(data.published_at),'d MMM y', {locale: ptBR}),//transforma string em date
      duration: Number(data.file.duration),
      durationAsString: convertDurantionToTimeString(Number(data.file.duration)),
      description: data.description,
      url: data.file.url,
  };

  return {
    props:{
      episode,
    },
    revalidate: 60*60*24, //24 horas
  }
}