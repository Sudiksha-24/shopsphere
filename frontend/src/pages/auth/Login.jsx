import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );


      if (!response.ok) {

        throw new Error(
          "Invalid email or password"
        );

      }


      const data = await response.json();

      console.log("Login response:", data);


      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );


      // Save logged-in user ID
      localStorage.setItem(
        "userId",
        data.userId
      );


      // Success message
      setSuccess(
        "Login successful!"
      );


      // Redirect to Home
      setTimeout(() => {

        navigate("/");

      }, 500);


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
        "Something went wrong. Please try again."
      );


    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">

      <div className="login-card">


        {/* Heading */}

        <div className="login-heading">

          <p>WELCOME BACK</p>

          <h1>
            Login to ShopSphere
          </h1>

          <span>
            Enter your details to continue shopping.
          </span>

        </div>


        {/* Login Form */}

        <form onSubmit={handleLogin}>


          {/* Email */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          {/* Error */}

          {error && (

            <p className="login-error">
              {error}
            </p>

          )}


          {/* Success */}

          {success && (

            <p className="login-success">
              {success}
            </p>

          )}


          {/* Login Button */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>


        </form>

      </div>

    </div>

  );
}

export default Login;