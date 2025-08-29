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
        <h1 className="font-semibold mb-12">
          Personalised Instagram analytics. Secure, insightful, and easy on the
          eyes.
        </h1>
        <p className="mt-2 text-lg text-[#a8a8a8] mb-12">
          Unlike other analytics platforms, we do not require you to give us
          your account information. All data you provide is{" "}
          <span className="text-[#cccccc] font-semibold">encrypted</span>{" "}
          and&nbsp;
          <span className="text-[#cccccc] font-semibold">
            deleted after use
          </span>
          .
        </p>
        <div className="flex flex-col items-center bg-linear-25 from-[rgba(255,255,255,0.05)] to-[rgba(64,64,64,0.05)] rounded-md border-2 border-dotted p-12 border-[#a8a8a8]">
          <div className="flex w-full items-center gap-3">
            <Input
              type="file"
              accept=".zip"
              id="file-upload"
              className="w-full rounded-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleFileUpload}
              className="bg-[#342792] p-4 rounded-sm"
            >
              <span>Upload Folder</span>
            </Button>
          </div>
          <p className="text-[#8c8c8c] mt-6 text-[13px] max-w-[30ch]">
            Use the downloaded ZIP folder from
            <a
              href="https://www.instagram.com/data-download"
              className="underline"
            >
              {" "}
              www.instagram.com/data-download
            </a>
          </p>
        </div>
      </div>
      <div className="flex-none">
        <div className="w-128"></div>
      </div>
    </div>
  );
};

export default HeroSection;
