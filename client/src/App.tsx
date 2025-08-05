import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:8000/parse-zip", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".zip"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleFileUpload}>Upload Folder</button>
    </>
  );
}

export default App;
