import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="e-Voting Homepage">
    <div className="mid">
      <h1 className="text-center">Hello World 👋</h1>
      <p className="text-center">
        <Link href="/about">
          <a>DAGHE</a>
        </Link>
      </p>
    </div>
  </Layout>
)

export default IndexPage
