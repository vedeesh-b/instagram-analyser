import { useState } from "react";
import "./App.css";
import axios, { type AxiosResponse } from "axios";

interface InstagramUser {
  username: string;
  href: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [notFollowingBack, setNotFollowingBack] = useState<
    InstagramUser[] | null
  >(null);

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:8000/parse-zip", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await axios
      .get("http://localhost:8000/people-not-following-user")
      .then((res) => {
        setNotFollowingBack(res.data);
        console.log(typeof res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <input
        type="file"
        accept=".zip"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleFileUpload}>Upload Folder</button>
      <ul>
        {notFollowingBack &&
          notFollowingBack.map((user) => <li>{user.username}</li>)}
      </ul>
    </>
  );
}

export default App;
