import { useState, type SubmitEvent} from "react";
import { Link, useNavigate } from "react-router";

type LoginApiResponse = {
    message? : string;
    token? : string;
    user? : {
        id: string;
        email: string;
        createdAt: string;
        firstName: string;
    };
};

function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    async function handleSubmit(event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        setLoading(true);

        try{
            const response = await fetch("http://localhost:4000/auth/login",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = (await response.json()) as LoginApiResponse;

            if(!response.ok){
                setError(data.message ?? "Login Failed");
                return;
            }

            if (!data.token){
                setError("Login response did not include a token");
                return;
            }
            
            if(!data.user?.firstName){
                setError("Login response did not include a first name");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("firstName", data.user?.firstName);
            navigate("/dashboard");
        } catch {
            setError("Could not connect to API");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                    id="password"
                    type="password"
                    value= {password}
                    onChange={(event)=> setPassword(event.target.value)} 
                    required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p>
                New User? <Link to="/register">Create an account</Link>
            </p>
        </main>
    );
}


export default LoginPage

