import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import privacyIcon from "../assets/privacy-icon.png";
import quickIcon from "../assets/quick-icon.png";
import personalIcon from "../assets/personal-icon.png";

interface CardType {
  title: string;
  content: string;
  iconPath: string;
}

const CardGroup = () => {
  const cards: CardType[] = [
    {
      title: "Privacy by default",
      content:
        "You retain full control over their data, with no cloud syncing or third-party sharing.",
      iconPath: privacyIcon,
    },
    {
      title: "Quick and simple",
      content:
        "No logins, ads, or clutter. Upload your folder and we’ll take over from there.",
      iconPath: quickIcon,
    },
    {
      title: "Your story, visualised",
      content:
        "This tool isn’t about throwing charts at you - we’re highlighting your unique personality.",
      iconPath: personalIcon,
    },
  ];

  return (
    <div className="flex flex-row justify-between rounded-lg border-[0] gap-12">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="bg-linear-to-t from-[#232130] to-[#1F1F1F] w-sm border-none"
        >
          <CardHeader>
            <div className="bg-radial from-[rgba(53,42,129,25%)] from-opacity-25 to-[rgba(89,79,166,25%)] to-opacity-25 rounded-md w-[fit-content] mb-16">
              <img src={card.iconPath} alt={card.title} className="w-8 m-2" />
            </div>
            <CardTitle className="text-white font-medium text-[28px] font-['Instrument_Sans'] mb-4">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#cccccc] text-[16px] mb-16">{card.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardGroup;
