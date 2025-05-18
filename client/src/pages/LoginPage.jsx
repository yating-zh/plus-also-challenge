import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function LoginPage() {
  //const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setError("");
        navigate("/upload");
      } else {
        const data = await res.json();
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="container">
          <Nav />
          <p className="text-center fw-bold fs-3 fs-sm-4 fs-md-3 fs-lg-1 mt-5">
            Powerful AI Image Enhancer
          </p>
          <main role="main">
            <div className="jumbotron bg-image-jumbotron"></div>
            <div className="jumbotron col-sm-8 mx-auto">
              <div className="noise">
                <p className="lead mt-5">
                  1. Specify a prompt to modify the image.{" "}
                </p>
                <p className="lead">2. Select the aspect ratio. </p>
                <p className="lead">3. Download your image.</p>

                <p className="mt-5 mx-auto">
                  Please contact Yating to get a password.
                </p>
                <form onSubmit={handleSubmit} className="d-flex flex-column">
                  <input
                    className="form-control form-control-lg mb-2"
                    placeholder="Enter the password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-lg">
                    Go
                  </button>
                </form>
                {error && <p className="text-danger mt-2">{error}</p>}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />

    </>
  );
}

export default LoginPage;
