import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ShoppingBag, Coins, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CreateItemDialog from './CreateItemDialog';
import WalletCard from './WalletCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ShoppingCard = () => {
  const { shoppingItems, purchaseItem, walletBalance, deleteShoppingItem } = useApp();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handlePurchase = (itemId: string, itemName: string, price: number) => {
    const success = purchaseItem(itemId);
    if (success) {
      toast.success(
        <div className="flex items-center gap-2">
          <span>Purchased {itemName}! 🎉</span>
        </div>
      );
    } else {
      toast.error(`Not enough coins! You need ${price - walletBalance} more.`);
    }
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteShoppingItem(itemToDelete);
      toast.success('Item deleted from store');
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-7 h-7" />
          Shopping Store
        </h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WalletCard balance={walletBalance} />
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shoppingItems.map(item => (
              <Card key={item.id} className="bg-card/50 border-border hover:border-primary/50 transition-all group relative">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteClick(item.id)}
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{item.emoji}</span>
                      <span className="text-lg">{item.name}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-coin">
                      <Coins className="w-5 h-5" />
                      <span className="text-xl font-bold">{item.price}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(item.id, item.name, item.price)}
                      disabled={walletBalance < item.price}
                      className="bg-gradient-primary hover:opacity-90 disabled:opacity-50"
                    >
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {shoppingItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No items in the store yet. Add your first one!</p>
            </div>
          )}
        </div>
      </div>

      <CreateItemDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this item from the shopping store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShoppingCard;
