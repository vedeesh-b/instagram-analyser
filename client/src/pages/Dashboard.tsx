import { Navbar } from "./custom-components/Navbar";
import type { CardProps } from "./custom-components/DataCard";
import DataCard from "./custom-components/DataCard";

const Dashboard = () => {
  const cardData: CardProps[] = [
    {
      title: "Posts liked per day",
      children: 8.31,
    },
    {
      title: "Total comments",
      children: 1031,
    },
    {
      title: "Account start date",
      children: "23 June 2019",
    },
  ];
  return (
    <div className="mb-60">
      <Navbar />
      <div
        id="landing-sections"
        className="px-60 my-32 flex flex-row justify-between"
      >
        {cardData.map((card, index) => (
          <DataCard key={index} title={card.title}>
            {card.children}
          </DataCard>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
