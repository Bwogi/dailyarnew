// components/ui/styled-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StyledCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
}

export function StyledCard({
  children,
  className,
  title,
  noPadding,
}: StyledCardProps) {
  return (
    <Card className={cn("glass-morphism card-hover", className)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg gradient-text">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(noPadding ? "p-0" : "p-6")}>
        {children}
      </CardContent>
    </Card>
  );
}
