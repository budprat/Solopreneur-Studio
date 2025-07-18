import { Menu, Mic, Moon, Sun, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export function TopBar({ onMenuClick, title = "Dashboard", subtitle = "Welcome back! Here's what's happening with your AI business." }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Voice Command Button */}
          <Button size="icon" className="gradient-bg text-white">
            <Mic className="w-4 h-4" />
          </Button>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </Button>
          
          {/* User Profile */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
                  <img
                    src={user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                    alt={user.firstName || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      AI Solopreneur
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
