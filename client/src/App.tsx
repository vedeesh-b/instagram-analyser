import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Button } from "./components/ui/button";

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
      <Button onClick={handleFileUpload}>Upload Folder</Button>
      <ul>
        {notFollowingBack &&
          notFollowingBack.map((user) => <li>{user.username}</li>)}
      </ul>
    </>
  );
}

export default App;
