import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); 
    setStatus("");         
  };

  
  const handleUpload = async () => {
    
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      setStatus("✅ Upload Successful: " + response.data.filename);
      console.log("Server Response:", response.data);

    } catch (error) {
      console.error("Error uploading:", error);
      setStatus("❌ Upload Failed. Is the backend running?");
    }
  };

  return (
    <div className="app-container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🤖 AI Interviewer</h1>
      <p>Upload your resume (PDF) to get started.</p>

      {/* The Upload Box */}
      <div style={{ border: "2px dashed #ccc", padding: "40px", display: "inline-block" }}>
        
        {/* Input for File */}
        <input type="file" onChange={handleFileChange} accept=".pdf" />
        <br /><br />
        
        {/* The Button */}
        <button 
          onClick={handleUpload} 
          style={{ 
            padding: "10px 20px", 
            cursor: "pointer", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px" 
          }}
        >
          Upload Resume
        </button>
      </div>

      {/* Status Message Area */}
      {status && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{status}</p>}
    </div>
  );
}

export default App;