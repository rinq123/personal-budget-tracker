import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";

type RegisterAPIResponse = {
    message?: string ;
    user?: {
        id? : string;
        email?:string;
        createdAt: string;
    };
};

function RegisterPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function HandleSubmit( event: ChangeEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        setLoading(true);


        try{
            const response = await fetch("http://localhost:4000/auth/register",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = (await response.json()) as RegisterAPIResponse;

            if(!response.ok){
                setError(data.message ?? "Register failed");
                return;
            }

            navigate("/login");
        }catch{
            setError("Could not connect to the API");
        }finally{
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Register</h1>
            <form onSubmit={HandleSubmit}>
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
                    value={password}
                    onChange={(event)=> setPassword(event.target.value)}
                    required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register" }
                </button>

                <p>
                    Existing User?<Link to = "/login">Log in</Link>
                </p>
            </form>
        </main>
    );
}

export default RegisterPage

