import Layout from '../../components/Layout'

const AdminDashboard = () => {
    return (
        <Layout title="Admin Dashboard">
            <div className="mid">
                <div className="container col-xxl-8 px-2 py-3">
                    <div>
                        <h1 className="text-center mb-4">Admin Dashboard</h1>
                        <h3 className="text-center my-4">Elections</h3>
                        
                        <h3 className="text-center my-4">Political Parties</h3>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
  
  export default AdminDashboard