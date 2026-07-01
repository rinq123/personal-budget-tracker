import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { API_URL } from "../lib/api";

type RegisterAPIResponse = {
    message?: string;
    errors?:{
        fieldErrors?:{
            email?: string[];
            password?: string[];
            firstName?: string[];
        };
    };
    user?: {
        id? : string;
        email?:string;
        createdAt: string;
        firstName? : string;
    };
};

function RegisterPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function HandleSubmit( event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        setLoading(true);


        try{
            const response = await fetch(`${API_URL}/auth/register`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                }),
            });

            const data = (await response.json()) as RegisterAPIResponse;

            if(!response.ok){
                const passwordError = data.errors?.fieldErrors?.password?.[0];
                const emailError = data.errors?.fieldErrors?.email?.[0];
                const firstNameError = data.errors?.fieldErrors?.firstName?.[0];

                setError(
                    passwordError ??
                    emailError ??
                    firstNameError ??
                    data.message ??
                    "Register failed"
                );
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
                    <label htmlFor="firstName">First Name</label>
                        <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
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

