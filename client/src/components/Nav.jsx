import { useState } from "react";

function Nav(){
    const [isOpen, setIsOpen] = useState(false);
    return (
    <>

          {/*<header className="masthead mb-auto">
        <div className="inner">
          <h3 className="masthead-brand  ">AI Enhancer</h3>
          <nav className="nav nav-masthead justify-content-center">
            <a className="nav-link active" href="#">Home</a>
            <a className="nav-link" href="#">Features</a>
            <a className="nav-link" href="#">Contact</a>
          </nav>

        </div>
      </header>*/}
<nav className="navbar navbar-expand-lg navbar-light bg-light rounded">
  <a className="navbar-brand ms-3" href="/">
    AI Challenge - Image Enhancer
  </a>

  <button
    className="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarsExample09"
    aria-controls="navbarsExample09"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarsExample09">
    <ul className="navbar-nav ms-auto">
      <li className="nav-item active">
        <a className="nav-link" href="/">
          Home 
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/upload">Image Enhancer</a>
      </li>
      {/*<li className="nav-item">
        <a className="nav-link disabled" href="#">Disabled</a>
      </li>*/}
      {/*<li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          Dropdown
        </a>
        {isOpen && (
          <div className="dropdown-menu show">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
        )}
      </li>*/}
    </ul>
  </div>
</nav>



    </>
    );
}

export default Nav