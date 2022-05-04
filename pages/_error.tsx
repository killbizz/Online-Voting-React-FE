import Link from "next/link";
import Layout from "../components/Layout"
import { NextPageContext } from 'next';

interface CustomErrorProps {
  statusCode: number;
  description: string
}

const CustomError = ({ statusCode, description }: CustomErrorProps) => {
  return (
    <>
      <Layout title="Error">
        <h1 className="text-center">Oooops</h1>
        <h2>
            {statusCode
            ? 'The following Server-side error occurred:'
            : 'The following Client-side error occurred:'
            }
        </h2>
        <ul className="text-center">
            <li>Status Code: ${statusCode}</li>
            <li>Description: ${description}</li>
        </ul>
        <h2 className="text-center">Please remember that this is a PROTOTYPE website and:</h2>
        <ul className="text-center">
            <li>The website security was not the focus of the project</li>
            <li>there may be server-side errors or performance problems due to the database</li>
        </ul>
        <h4>
          Go back to the
          <Link href="/"> Homepage </Link>
        </h4>
      </Layout>
    </>
  );
};

CustomError.getInitialProps = async (ctx: NextPageContext) => {
    const {res, err} = ctx;
    const cause = err?.cause ? err.cause : "";
    const message = err?.message ? err.message : "";
    const stack = err?.stack ? err.stack : "";
    const ds = message + " - " + cause + " - " + stack;
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404

    return {
        statusCode,
        ds
    };
  }

export default CustomError;