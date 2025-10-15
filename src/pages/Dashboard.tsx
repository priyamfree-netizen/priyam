import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Token } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Plus, Coins } from 'lucide-react';
import TokenCard from '@/components/TokenCard';
import CreateTokenDialog from '@/components/CreateTokenDialog';
import EditTokenDialog from '@/components/EditTokenDialog';
import TokenDetailDialog from '@/components/TokenDetailDialog';
import ShoppingCard from '@/components/ShoppingCard';
import WalletCard from '@/components/WalletCard';
import HistorySection from '@/components/HistorySection';
import StatsCard from '@/components/StatsCard';
import { toast } from 'sonner';
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

type DashboardTab = 'work' | 'physical' | 'shopping' | 'history';

const Dashboard = () => {
  const { isAuthenticated, logout, tokens, walletBalance, deleteToken } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('work');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<Token | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'coins'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filterTokens = (tokenList: Token[]) => {
    let filtered = [...tokenList];
    
    // Filter by coin range
    if (filterBy !== 'all') {
      if (filterBy === 'low') filtered = filtered.filter(t => t.coins <= 3);
      if (filterBy === 'medium') filtered = filtered.filter(t => t.coins >= 4 && t.coins <= 6);
      if (filterBy === 'high') filtered = filtered.filter(t => t.coins >= 7);
    }
    
    // Sort
    if (sortBy === 'coins') {
      filtered.sort((a, b) => b.coins - a.coins);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return filtered;
  };

  const workTokens = filterTokens(tokens.filter(t => t.type === 'work' && t.status === 'pending'));
  const physicalTokens = filterTokens(tokens.filter(t => t.type === 'physical' && t.status === 'pending'));

  const handleDeleteClick = (tokenId: string) => {
    setTokenToDelete(tokenId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tokenToDelete) {
      deleteToken(tokenToDelete);
      toast.success('Token deleted successfully');
      setTokenToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-2xl">
                🎯
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Priyam Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <WalletCard balance={walletBalance} compact />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <StatsCard />
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-card/50 p-1">
            <TabsTrigger value="work" className="data-[state=active]:bg-gradient-primary">
              💼 Work
            </TabsTrigger>
            <TabsTrigger value="physical" className="data-[state=active]:bg-gradient-primary">
              💪 Physical
            </TabsTrigger>
            <TabsTrigger value="shopping" className="data-[state=active]:bg-gradient-primary">
              🛒 Shopping
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-primary">
              📜 History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Work Tokens</h2>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'coins')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest</SelectItem>
                    <SelectItem value="coins">Coins</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBy} onValueChange={(v) => setFilterBy(v as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">1-3 🪙</SelectItem>
                    <SelectItem value="medium">4-6 🪙</SelectItem>
                    <SelectItem value="high">7-10 🪙</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Token
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workTokens.map(token => (
                <TokenCard 
                  key={token.id} 
                  token={token}
                  onClick={() => setSelectedToken(token.id)}
                  onEdit={() => setEditToken(token)}
                  onDelete={() => handleDeleteClick(token.id)}
                />
              ))}
              {workTokens.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-lg">No work tokens yet. Create your first one!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="physical" className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Physical Tokens</h2>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'coins')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest</SelectItem>
                    <SelectItem value="coins">Coins</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBy} onValueChange={(v) => setFilterBy(v as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">1-3 🪙</SelectItem>
                    <SelectItem value="medium">4-6 🪙</SelectItem>
                    <SelectItem value="high">7-10 🪙</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Token
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {physicalTokens.map(token => (
                <TokenCard 
                  key={token.id} 
                  token={token}
                  onClick={() => setSelectedToken(token.id)}
                  onEdit={() => setEditToken(token)}
                  onDelete={() => handleDeleteClick(token.id)}
                />
              ))}
              {physicalTokens.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-lg">No physical tokens yet. Create your first one!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="space-y-6 animate-slide-up">
            <ShoppingCard />
          </TabsContent>

          <TabsContent value="history" className="space-y-6 animate-slide-up">
            <HistorySection />
          </TabsContent>
        </Tabs>
      </main>

      <CreateTokenDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultType={activeTab === 'physical' ? 'physical' : 'work'}
      />

      {editToken && (
        <EditTokenDialog
          open={!!editToken}
          onOpenChange={(open) => !open && setEditToken(null)}
          token={editToken}
        />
      )}

      <TokenDetailDialog
        tokenId={selectedToken}
        onClose={() => setSelectedToken(null)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Token?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this token.
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

export default Dashboard;
