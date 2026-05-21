import { Link, useNavigate } from "react-router";
import { useEffect } from "react";



function DashboardPage(){

    const navigate = useNavigate();
    const firstName = localStorage.getItem("firstName");


    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
        }
    }, [navigate])

    function handleLogout(){
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        navigate("/login");
    }

    return (
        <main>
            <section>
                <h1>Welcome, {firstName}</h1>
                <p>Track your spending, manage your categories and plan your budget.</p>
            </section>

            <section>
                <h2>Quick actions</h2>
                <div>
                    <Link to ="/transactions">View transactions</Link>
                    <Link to ="/categories">Manage categories</Link>
                    <Link to ="/budgets">View budgets</Link>
                </div>
            </section>

            <section>
                <button type="button" onClick={handleLogout}>Logout</button>
            </section>
        </main>
    );
}

export default DashboardPage

