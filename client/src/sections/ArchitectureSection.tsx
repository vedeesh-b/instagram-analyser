import architecturePath from "../assets/architecture.png";

export const ArchitectureSection = () => {
  return (
    <div>
      <h2 className="uppercase font-semibold tracking-[0.1em] text-[20px] mb-24">
        How it works
      </h2>
      <img className="px-32" src={architecturePath} alt="Architecture" />
    </div>
  );
};
