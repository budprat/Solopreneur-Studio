import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  color?: string;
}

interface AnimatedStatsProps {
  title: string;
  stats: StatItem[];
  delay?: number;
  className?: string;
}

export function AnimatedStats({ 
  title, 
  stats, 
  delay = 0,
  className 
}: AnimatedStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-2">
                    {Icon && (
                      <div className={`p-2 rounded-full ${stat.color || 'bg-blue-500'}`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <motion.p 
                        className="text-lg font-bold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: delay + (index * 0.1) + 0.2 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                  </div>
                  {stat.change !== undefined && (
                    <Badge 
                      variant={stat.change >= 0 ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {stat.change >= 0 ? "+" : ""}{stat.change}%
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}