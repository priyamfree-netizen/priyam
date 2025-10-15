import { useState, useEffect } from 'react';
import { useApp, Token } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EditTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: Token;
}

const EditTokenDialog = ({ open, onOpenChange, token }: EditTokenDialogProps) => {
  const { editToken } = useApp();
  const [name, setName] = useState(token.name);
  const [description, setDescription] = useState(token.description);
  const [emoji, setEmoji] = useState(token.emoji);
  const [coins, setCoins] = useState(token.coins);

  const commonEmojis = ['⭐', '🎯', '💼', '📚', '💪', '🏃', '🎮', '🎨', '🔥', '⚡', '🌟', '✨', '🎉', '🚀', '💎', '🏆', '⚙️', '🧠', '📊', '💻', '📝', '🎓', '🔬', '🎪', '🌈', '🎭', '🎬', '🎵', '🎸', '⚽', '🏀', '🎾', '🏋️', '🧘', '🍎', '☕', '🌍', '🌙', '☀️', '🌱'];

  useEffect(() => {
    setName(token.name);
    setDescription(token.description);
    setEmoji(token.emoji);
    setCoins(token.coins);
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (coins < 1 || coins > 10) {
      toast.error('Coins must be between 1 and 10');
      return;
    }

    editToken(token.id, {
      name,
      description,
      emoji,
      coins,
    });

    toast.success('Token updated successfully! ✏️');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Token</DialogTitle>
          <DialogDescription>
            Update your task details
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Complete project report"
              required
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Finish the quarterly report and submit to team"
              required
              className="bg-secondary/50 min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Choose Emoji</Label>
            <div className="grid grid-cols-8 gap-2">
              {commonEmojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    emoji === e 
                      ? 'bg-primary scale-110' 
                      : 'bg-secondary/50 hover:bg-secondary hover:scale-105'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <Input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="Or type custom emoji"
              className="bg-secondary/50 mt-2"
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coins">Reward Coins (1-10)</Label>
            <Input
              id="coins"
              type="number"
              min="1"
              max="10"
              value={coins}
              onChange={(e) => setCoins(parseInt(e.target.value) || 0)}
              required
              className="bg-secondary/50"
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              Update Token
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTokenDialog;
