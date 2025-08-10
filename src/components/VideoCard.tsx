import { Play, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  description: string;
}

const VideoCard = ({ title, thumbnail, duration, views, category, description }: VideoCardProps) => {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-primary rounded-full p-3">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {duration}
        </div>
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Eye className="h-3 w-3 mr-1" />
          {views} vues
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;