import { GetServerSideProps, GetStaticPropsResult } from 'next';
import Layout from '../../components/Layout';

interface ElectionPageProps {
    
}

const ElectionPage = () => {
    return(
        <Layout title="e-Voting User Dashboard">
            <div className="mid">
                <h1 className="text-center my-4">DAGHE</h1>
            </div>
        </Layout>
    );
}

// TODO : prendo parametro dall'URL e lo passo tra i props

export const getServerSideProps: GetServerSideProps<ElectionPageProps> = async ({ req }): Promise<GetStaticPropsResult<ElectionPageProps>> => {
    // session handling using cookies
    if(!(req.cookies.jwtToken !== undefined && req.cookies.userRole !== "admin")) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        parties: await getParties()
      }
    };
};

export default ElectionPage;