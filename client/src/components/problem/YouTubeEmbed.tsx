import React from 'react';
import { Youtube, ExternalLink, VideoOff } from 'lucide-react';
import { IYouTubeVideo } from '../../types';
import { Card } from '../ui/Card';

interface YouTubeProps {
  video?: IYouTubeVideo;
}

export const YouTubeEmbed: React.FC<YouTubeProps> = ({ video }) => {
  if (!video || !video.videoId) {
    return (
      <Card className="p-8 text-center text-muted-foreground border-dashed">
        <VideoOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-sm font-medium">No verified video explanation available for this problem yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Check out the step-by-step approach guides and reference solutions.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{video.title}</h3>
            <p className="text-xs text-muted-foreground">Channel: {video.channel}</p>
          </div>
        </div>

        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
        >
          Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </Card>
  );
};
