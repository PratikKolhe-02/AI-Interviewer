import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [resumeText, setResumeText] = useState(""); // New: Store the read text

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
    setResumeText(""); // Clear old text when picking new file
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading and analyzing...");

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus("✅ Success! Resume analyzed.");
      
      // Save the text we got back from the server
      setResumeText(response.data.extractedText); 
      
      console.log("Server Response:", response.data);

    } catch (error) {
      console.error("Error uploading:", error);
      setStatus("❌ Upload Failed. Check console.");
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h1>🤖 AI Interviewer</h1>
      <p>Upload your resume to extract skills and experience.</p>

      <div style={{ border: "2px dashed #ccc", padding: "20px", marginBottom: "20px" }}>
        <input type="file" onChange={handleFileChange} accept=".pdf" />
        <br /><br />
        <button 
          onClick={handleUpload} 
          style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}
        >
          Analyze Resume
        </button>
      </div>

      {status && <p style={{ fontWeight: "bold" }}>{status}</p>}

      {/* Display the extracted text if available */}
      {resumeText && (
        <div style={{ marginTop: "30px", textAlign: "left" }}>
          <h3>📄 What the AI Found:</h3>
          <textarea 
            value={resumeText} 
            readOnly 
            style={{ width: "100%", height: "300px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;