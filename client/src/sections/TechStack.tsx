import pythonImg from "../assets/python.png";
import reactImg from "../assets/react.png";
import tsImg from "../assets/ts.png";
import fastapiImg from "../assets/fastapi.png";
import shadcnImg from "../assets/shadcn.png";
import tailwindImg from "../assets/tailwind.png";

interface TechType {
  imgPath: string;
  name: string;
  url: string;
}

export const TechStack = () => {
  const technologies: TechType[] = [
    {
      name: "Python",
      url: "https://www.python.org/",
      imgPath: pythonImg,
    },
    {
      name: "React",
      url: "https://react.dev/",
      imgPath: reactImg,
    },
    {
      name: "TypeScript",
      url: "https://www.typescriptlang.org/",
      imgPath: tsImg,
    },
    {
      name: "FastAPI",
      url: "https://fastapi.tiangolo.com/",
      imgPath: fastapiImg,
    },
    {
      name: "ShadCN",
      url: "https://ui.shadcn.com/",
      imgPath: shadcnImg,
    },
    {
      name: "Tailwind CSS",
      url: "https://tailwindcss.com/",
      imgPath: tailwindImg,
    },
  ];
  return (
    <div>
      <h2 className="uppercase tracking-[0.1em] font-semibold text-[20px] mb-32">
        Tech Stack
      </h2>
      <div className="flex flex-row px-32 justify-between">
        {technologies.map((tech) => (
          <img src={tech.imgPath} alt={tech.name} />
        ))}
      </div>
    </div>
  );
};
