import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

const ArticleCard = ({ title, excerpt, author, date, category, readTime, image }: ArticleCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {excerpt}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {date}
            </div>
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {readTime} min
          </span>
        </div>
        
        <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors justify-between">
          Lire l'article
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;