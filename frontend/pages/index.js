import Head from 'next/head'
import ProductResearchAgent from '../components/ui/ProductResearchAgent'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Vendoract</title>
      </Head>
      <ProductResearchAgent />
    </div>
  )
}
