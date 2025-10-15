import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { TrendingUp, Target, Flame } from 'lucide-react';

const StatsCard = () => {
  const { tokens, walletBalance, streak, transactions } = useApp();

  const completedTokens = tokens.filter(t => t.status === 'done').length;
  const pendingTokens = tokens.filter(t => t.status === 'pending').length;
  const completionRate = tokens.length > 0 ? Math.round((completedTokens / tokens.length) * 100) : 0;
  const totalEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      label: 'Current Streak',
      value: `${streak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Earned',
      value: `${totalEarned} 🪙`,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;
