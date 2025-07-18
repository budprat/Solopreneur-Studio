import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Calendar, User, Filter } from "lucide-react";
import { RevenueTracking } from "@shared/schema";

export default function Revenue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: revenueData, isLoading } = useQuery<RevenueTracking[]>({
    queryKey: ['/api/revenue'],
  });

  const filteredRevenue = revenueData?.filter(item => {
    const matchesSearch = item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const getTypeColor = (type: string) => {
    const colors = {
      'payment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'invoice': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'expense': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getTotalByType = (type: string) => {
    return revenueData?.filter(item => item.type === type)
      .reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
  };

  const getMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return revenueData?.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === currentMonth && 
             itemDate.getFullYear() === currentYear &&
             item.type === 'payment';
    }).reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
  };

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return revenueData?.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === currentMonth && 
             itemDate.getFullYear() === currentYear &&
             item.type === 'expense';
    }).reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
  };

  const getOutstandingInvoices = () => {
    return revenueData?.filter(item => 
      item.type === 'invoice' && (item.status === 'pending' || item.status === 'overdue')
    ).reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Revenue Analytics</h1>
          <p className="text-muted-foreground">Track your income, expenses, and financial performance</p>
        </div>
        <Button className="gradient-bg">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(getMonthlyRevenue().toString())}</p>
                <p className="text-sm text-accent font-medium">+23% from last month</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(getMonthlyExpenses().toString())}</p>
                <p className="text-sm text-error font-medium">+5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-error" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding Invoices</p>
                <p className="text-2xl font-bold">{formatCurrency(getOutstandingInvoices().toString())}</p>
                <p className="text-sm text-warning font-medium">3 overdue</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">
                  {formatCurrency((getMonthlyRevenue() - getMonthlyExpenses()).toString())}
                </p>
                <p className="text-sm text-primary font-medium">18% margin</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="invoice">Invoices</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRevenue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {item.description || `${item.type} #${item.id}`}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    item.type === 'expense' ? 'text-error' : 'text-accent'
                  }`}>
                    {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredRevenue.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first transaction"
            }
          </p>
          <Button className="gradient-bg">
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      )}
    </div>
  );
}
