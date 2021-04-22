export default function Home(props) {
  //useEffect()quando algo da aplicação acontecer, um evento será inciado->1ºoq/2ºqnd(array)
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps(){
  const response =  await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props:{
      episodes:data,
    },
    revalidate:60*60*8, //tempo para nova requisição
  }
}