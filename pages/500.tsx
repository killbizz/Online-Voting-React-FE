import Link from "next/link";
import Layout from "../components/Layout"

const CustomError = () => {
  return (
    <>
      <Layout title="Error">
        <h1 className="text-center my-4">Oooops</h1>
        <h2 className="text-center my-4 ">
          A Server-side Error occurred 🤔
        </h2>
        <h2 className="text-center my-5">Please remember that this is a PROTOTYPE website and:</h2>
        <ul className="text-center my-2">
            <li>The website security was not the focus of the project</li>
            <li>There may be server-side errors or performance problems due to the database</li>
        </ul>
        <h4 className="text-center my-5">
          Go back to the
          <Link href="/"> Homepage </Link>
        </h4>
      </Layout>
    </>
  );
};

export default CustomError;