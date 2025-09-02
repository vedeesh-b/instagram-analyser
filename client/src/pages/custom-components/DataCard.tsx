import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CardProps {
  title: string;
  children: React.ReactNode;
}

const DataCard = (props: CardProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default DataCard;
