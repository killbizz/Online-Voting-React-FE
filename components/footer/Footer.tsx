const Footer = () => {
    return (
        <footer className="footer mt-auto py-3">
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <span className="text-muted">&copy; 2021-2022 Gabriel Bizzo</span>
                    </div>
                    <div className="col-6">
                        <a href="https://github.com/killbizz/Online-Voting-React-FE">
                            <i className="fa fa-github fa-2x github-logo" />
                        </a>
                    </div>    
                </div>
            </div>
        </footer>
    );
};

export default Footer