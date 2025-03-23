import Head from 'next/head'
import ProductResearchAgent from '../components/ui/ProductResearchAgent'

export default function Home() {
  return (
    <div>
      <Head>
        <title>LLM Product Research Agent</title>
      </Head>
      <ProductResearchAgent />
    </div>
  )
}
