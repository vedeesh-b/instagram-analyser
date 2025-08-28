import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

const HeroSection = () => {
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
  };
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <h1 className="font-semibold">
          Personalised Instagram analytics. Secure, insightful, and easy on the
          eyes.
        </h1>
        <p className="mt-2 text-lg">
          Unlike other live analytics platforms, we do not require you to give
          us your account information. All data you provide is encrypted and
          deleted after use.
        </p>
        <div>
          <Button onClick={handleFileUpload}>
            <span>Upload Folder</span>
          </Button>
          <Input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>
      <div className="flex-none"></div>
    </div>
  );
};

export default HeroSection;
