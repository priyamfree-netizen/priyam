import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

interface WalletCardProps {
  balance: number;
  compact?: boolean;
}

const WalletCard = ({ balance, compact = false }: WalletCardProps) => {
  const { transactions } = useApp();
  
  const totalEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSpent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-coin/10 border border-coin/20 px-4 py-2 rounded-lg">
        <Coins className="w-5 h-5 text-coin animate-pulse-slow" />
        <span className="font-bold text-lg">{balance}</span>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-primary border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Coins className="w-6 h-6 text-coin animate-pulse-slow" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-white">{balance} coins</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-success mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Earned</span>
            </div>
            <div className="text-xl font-bold text-white">{totalEarned}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-destructive mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">Spent</span>
            </div>
            <div className="text-xl font-bold text-white">{totalSpent}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
