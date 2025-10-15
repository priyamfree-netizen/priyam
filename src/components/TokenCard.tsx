import { Token } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Pencil, Trash2 } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TokenCard = ({ token, onClick, onEdit, onDelete }: TokenCardProps) => {
  const getGradientClass = (coins: number) => {
    if (coins <= 3) return 'bg-gradient-low';
    if (coins <= 6) return 'bg-gradient-medium';
    return 'bg-gradient-high';
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Card 
      className={`${getGradientClass(token.coins)} p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border-0 animate-scale-in relative group`}
      onClick={onClick}
    >
      {token.status === 'pending' && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleEdit}
            className="h-7 w-7 bg-black/30 hover:bg-black/50 text-white"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            className="h-7 w-7 bg-black/30 hover:bg-black/50 text-white"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-5xl">{token.emoji}</span>
          <div className="flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Coins className="w-4 h-4 text-coin" />
            <span className="font-bold text-white">{token.coins}</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg text-white line-clamp-1">
            {token.name}
          </h3>
          <p className="text-sm text-white/80 line-clamp-2 mt-1">
            {token.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-black/20 px-2 py-1 rounded-full text-white/90 backdrop-blur-sm">
            {token.type}
          </span>
          <span className="text-xs bg-black/20 px-2 py-1 rounded-full text-white/90 backdrop-blur-sm">
            {token.status}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TokenCard;
