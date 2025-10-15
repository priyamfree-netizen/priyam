import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType: 'work' | 'physical';
}

const CreateTokenDialog = ({ open, onOpenChange, defaultType }: CreateTokenDialogProps) => {
  const { addToken } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [coins, setCoins] = useState(5);
  const [type, setType] = useState<'work' | 'physical'>(defaultType);

  const commonEmojis = ['🎁', '☕', '🎬', '🎮', '📚', '🎧', '🍕', '🍰', '🎨', '🍲', '🥛', '🧋', '📱', '🎯', '🏆', '🍔', '🍜', '🍣', '🍦', '🍪', '🎪', '🎭', '🎤', '🎹', '💵', '🚴', '🎿', '🏖️', '🎢', '🎡', '🌺', '🌸', '🎈', '🎀', '💐', '🕹️', '🎲', '🧩', '🎳', '🥤'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (coins < 1 || coins > 10) {
      toast.error('Coins must be between 1 and 10');
      return;
    }

    addToken({
      name,
      description,
      emoji,
      coins,
      type,
    });

    toast.success(`Token created! Worth ${coins} coins 🪙`);
    
    // Reset form
    setName('');
    setDescription('');
    setEmoji('⭐');
    setCoins(5);
    setType(defaultType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Token</DialogTitle>
          <DialogDescription>
            Add a new task to your dashboard and set its reward
          </DialogDescription>
        </DialogHeader>
        
        <form id="token-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as 'work' | 'physical')}>
              <SelectTrigger id="type" className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="physical">💪 Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2 md:col-span-2">
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

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emoji-selector">Choose Emoji</Label>
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
                  aria-label={`Select emoji ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <Input
              id="emoji-input"
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

        </form>
        <DialogFooter className="mt-4">
          <Button type="submit" form="token-form" className="w-full bg-gradient-primary hover:opacity-90">
            Create Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTokenDialog;
