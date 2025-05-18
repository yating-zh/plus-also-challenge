import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "../../public/css/upload-page.css";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import { useState, useRef } from "react";
import axios from "axios";

function UploadPage() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1"); // ✅ Added state
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !prompt)
      return alert("Please upload an image and enter a prompt");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", `${prompt}; make aspect ratio to ${aspectRatio}`); // ✅ Inject ratio

    try {
      setSubmitting(true);
      setError(null);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const output = Array.isArray(res.data.output)
        ? res.data.output[0]
        : res.data.output;
      setResultImageUrl(output);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column min-vh-100">
        <Nav />

        <main className="flex-grow-1 d-flex flex-column align-items-center bg-white px-3">
          <div className="upload-wrapper w-100">
            {!(submitting || resultImageUrl || error) && (
              <form onSubmit={handleSubmit}>
                <p className="steps">
                  <i className="bi bi-1-circle-fill me-2"></i>
                  Upload your image
                </p>

                <div
                  className="upload-box bg-secondary-subtle text-center rounded p-4 mb-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file);
                  }}
                >
                  <div
                    className="upload-button rounded-pill d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      cursor: "pointer",
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#fff",
                    }}
                    onClick={() =>
                      preview
                        ? handleRemoveImage()
                        : fileInputRef.current?.click()
                    }
                  >
                    <span className="fs-1">{preview ? "×" : "+"}</span>
                  </div>

                  <input
                    type="file"
                    className="form-control d-none"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />

                  {preview ? (
                    <div className="mt-3">
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="text-muted">
                      Click + or drag and drop your image here
                    </div>
                  )}
                </div>

                <p className="steps">
                  <i className="bi bi-2-circle-fill"></i> Input your prompts
                </p>
                <div className="bg-secondary-subtle rounded p-3 mb-4">
                  <textarea
                    className="form-control"
                    placeholder="Enter your prompts here"
                    rows="4"
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  ></textarea>
                </div>

                <p className="steps">
                  <i className="bi bi-3-circle-fill me-2"></i>
                  Select the aspect ratio
                </p>
                <div className="form-group">
                  {["1:1", "16:9", "4:3", "21:9"].map((ratio, index) => (
                    <div className="form-check form-check-inline" key={ratio}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="aspectRatio"
                        id={`aspectRatio${index}`}
                        value={ratio}
                        checked={aspectRatio === ratio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`aspectRatio${index}`}
                      >
                        {ratio}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Submit
                  </button>
                </div>
              </form>
            )}

            {(submitting || resultImageUrl || error) && (
              <div className="display-box bg-secondary-subtle text-center rounded p-4 mb-4 mt-4">
                {submitting && (
                  <div className="text-center">
                    <span
                      className="spinner-border text-primary"
                      role="status"
                    ></span>
                    <p className="mt-3">Loading image...</p>
                  </div>
                )}

                {error && (
                  <div className="text-danger">
                    <p>{error}</p>
                  </div>
                )}

                {!submitting && !error && resultImageUrl ? (
                  <img
                    src={resultImageUrl}
                    alt="Generated"
                    className="img-fluid rounded"
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                ) : (
                  !submitting &&
                  !error && <i className="bi bi-image fs-1 text-muted"></i>
                )}
              </div>
            )}

            {(submitting || resultImageUrl || error) && (
              <div className="text-center mt-4">
                {resultImageUrl ? (
                  <a
                    href={resultImageUrl}
                    download="generated-image.png"
                    className="btn btn-primary btn-lg px-4"
                  >
                    <span className="me-2">
                      <i className="bi bi-download text-white"></i>
                    </span>
                    Download
                  </a>
                ) : (
                  <button className="btn btn-primary btn-lg px-4 disabled">
                    <span
                      className="spinner-border text-white"
                      role="status"
                    ></span>
                    <span className="fs-4 text-white my-5 ms-3">
                      Processing...
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default UploadPage;
