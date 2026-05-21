import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";


function DashboardPage(){

    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const firstName = user?.firstName;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
        }
    }, [navigate])


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
                <button type="button" onClick={logout}>Logout</button>
            </section>
        </main>
    );
}

export default DashboardPage

