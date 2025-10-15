import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Coins, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const HistorySection = () => {
  const { tokens, transactions } = useApp();
  
  const completedTokens = tokens.filter(t => t.status === 'done');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        📜 Activity History
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Tasks */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>✅</span>
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedTokens.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No completed tasks yet. Start completing tokens!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {completedTokens.map(token => (
                  <div 
                    key={token.id} 
                    className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <span className="text-2xl">{token.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{token.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="capitalize">{token.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(token.completedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-coin font-bold">
                      <Coins className="w-4 h-4" />
                      <span>+{token.coins}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-coin" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions yet. Complete tasks or make purchases!
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === 'earn' ? (
                        <ArrowUpCircle className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.type === 'earn' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      {(completedTokens.length > 0 || transactions.length > 0) && (
        <Card className="bg-gradient-primary border-0">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">{completedTokens.length}</div>
                <div className="text-sm text-white/80">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {completedTokens.reduce((sum, t) => sum + t.coins, 0)}
                </div>
                <div className="text-sm text-white/80">Total Coins Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {transactions.filter(t => t.type === 'spend').reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <div className="text-sm text-white/80">Total Coins Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistorySection;
