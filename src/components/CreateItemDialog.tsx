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
import { toast } from 'sonner';

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateItemDialog = ({ open, onOpenChange }: CreateItemDialogProps) => {
  const { addShoppingItem } = useApp();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎁');
  const [price, setPrice] = useState('10');

  const commonEmojis = ['🎁', '☕', '🎬', '🎮', '📚', '🎧', '🍕', '🍰', '🎨', '🍲', '🥛', '🧋', '📱', '🎯', '🏆', '🍔', '🍜', '🍣', '🍦', '🍪', '🎪', '🎭', '🎤', '🎹', '💵', '🚴', '🎿', '🏖️', '🎢', '🎡', '🌺', '🌸', '🎈', '🎀', '💐', '🕹️', '🎲', '🧩', '🎳', '🥤'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceValue = parseInt(price);
    if (priceValue < 1) {
      toast.error('Price must be at least 1 coin');
      return;
    }

    addShoppingItem({
      name,
      emoji,
      price: priceValue,
    });

    toast.success(`Item added to store! 🛒`);
    
    // Reset form
    setName('');
    setEmoji('🎁');
    setPrice('10');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Shopping Item</DialogTitle>
          <DialogDescription>
            Create a new reward you can purchase with your coins
          </DialogDescription>
        </DialogHeader>
        
        <form id="item-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Coffee Break"
              required
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (coins)</Label>
            <Input
              id="price"
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emoji-input">Choose Emoji</Label>
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

        </form>
        <DialogFooter className="mt-4">
          <Button type="submit" form="item-form" className="w-full bg-gradient-primary hover:opacity-90">
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemDialog;
