import { useApp } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Calendar, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

interface TokenDetailDialogProps {
  tokenId: string | null;
  onClose: () => void;
}

const TokenDetailDialog = ({ tokenId, onClose }: TokenDetailDialogProps) => {
  const { tokens, completeToken } = useApp();
  const token = tokens.find(t => t.id === tokenId);

  if (!token) return null;

  const handleComplete = () => {
    completeToken(token.id);
    toast.success(
      <div className="flex items-center gap-2">
        <span>Task completed! +{token.coins}</span>
        <Coins className="w-4 h-4 text-coin animate-coin-bounce" />
      </div>
    );
    onClose();
  };

  const getGradientClass = (coins: number) => {
    if (coins <= 3) return 'bg-gradient-low';
    if (coins <= 6) return 'bg-gradient-medium';
    return 'bg-gradient-high';
  };

  return (
    <Dialog open={!!tokenId} onOpenChange={() => onClose()}>
      <DialogContent className={`sm:max-w-md ${getGradientClass(token.coins)} border-0 text-white`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-3xl">
            <span className="text-5xl">{token.emoji}</span>
            <span>{token.name}</span>
          </DialogTitle>
          <DialogDescription className="text-white/90 text-base">
            {token.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 bg-black/20 px-4 py-3 rounded-lg backdrop-blur-sm">
            <Coins className="w-5 h-5 text-coin" />
            <span className="font-bold text-lg">Reward: {token.coins} coins</span>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-4 py-3 rounded-lg backdrop-blur-sm">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">
              Created: {new Date(token.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-4 py-3 rounded-lg backdrop-blur-sm">
            <span className="text-sm capitalize">Type: {token.type}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleComplete}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Done
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1 hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenDetailDialog;
