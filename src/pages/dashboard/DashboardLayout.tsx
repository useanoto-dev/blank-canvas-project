// Dashboard Layout - Anotô SaaS - Professional Design
import { useEffect, useState, useMemo, useCallback } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, ShoppingBag,
  Settings, CreditCard, LogOut, Menu, X, ExternalLink, Package,
  ChefHat, TicketPercent, Users, ChevronLeft, ChevronRight, TrendingUp,
  Monitor, UtensilsCrossed, ChevronDown, Workflow, Warehouse, Plug
} from "lucide-react";
import { QuickActionButtons } from "@/components/admin/QuickActionButtons";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getMenuThemeClasses, getCustomColorStyles, MENU_THEMES } from "@/components/admin/MenuThemeSelector";
import { preloadDashboardRoutes } from "@/hooks/useRoutePreloader";
import { useStockNotifications } from "@/hooks/useStockNotifications";
import { usePendingOrdersCount } from "@/hooks/usePendingOrdersCount";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface Store {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  onboarding_completed: boolean;
  use_comanda_mode?: boolean;
  sidebar_color?: string;
  is_open_override?: boolean | null;
  printnode_auto_print?: boolean | null;
}

interface Subscription {
  status: string;
  trial_ends_at: string | null;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  showAlways: boolean;
  requiresComandaMode?: boolean;
  subItems?: { icon: React.ComponentType<{ className?: string }>; label: string; path: string }[];
}

const allMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Início", path: "/dashboard", showAlways: true },
  { icon: Monitor, label: "PDV", path: "/dashboard/pdv", showAlways: true },
  { icon: UtensilsCrossed, label: "Mesas", path: "/dashboard/tables", showAlways: true },
  { icon: ChefHat, label: "Cozinha", path: "/dashboard/comandas", showAlways: false, requiresComandaMode: true },
  { icon: ShoppingBag, label: "Pedidos", path: "/dashboard/orders", showAlways: true },
  { icon: TrendingUp, label: "Analytics", path: "/dashboard/analytics", showAlways: true },
  { icon: Users, label: "Clientes", path: "/dashboard/customers", showAlways: true },
  { 
    icon: Package, 
    label: "Gestor de Cardápio", 
    path: "/dashboard/products", 
    showAlways: true,
    subItems: [
      { icon: Workflow, label: "Fluxos", path: "/dashboard/flows" }
    ]
  },
  { icon: Warehouse, label: "Estoque", path: "/dashboard/inventory", showAlways: true },
  { icon: TicketPercent, label: "Cupons", path: "/dashboard/coupons", showAlways: true },
  { icon: Image, label: "Banners", path: "/dashboard/banners", showAlways: true },
  { icon: Plug, label: "Integrações", path: "/dashboard/integrations", showAlways: true },
  { icon: Settings, label: "Configurações", path: "/dashboard/settings", showAlways: true },
  { icon: CreditCard, label: "Assinatura", path: "/dashboard/subscription", showAlways: true },
];

// Bottom navigation items for mobile - most important ones
const mobileNavItems = [
  { icon: LayoutDashboard, label: "Início", path: "/dashboard" },
  { icon: ShoppingBag, label: "Pedidos", path: "/dashboard/orders" },
  { icon: Monitor, label: "PDV", path: "/dashboard/pdv" },
  { icon: Package, label: "Cardápio", path: "/dashboard/products" },
  { icon: Menu, label: "Mais", path: "more" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [animatingIcon, setAnimatingIcon] = useState<string | null>(null);
  const [showCloseStoreDialog, setShowCloseStoreDialog] = useState(false);

  // Auto-expand menu if current path is a subitem
  useEffect(() => {
    allMenuItems.forEach(item => {
      if (item.subItems?.some(sub => location.pathname === sub.path)) {
        setExpandedMenus(prev => prev.includes(item.path) ? prev : [...prev, item.path]);
      }
    });
  }, [location.pathname]);

  // Stock notifications - realtime alerts when products reach low stock
  useStockNotifications({ storeId: store?.id ?? null });

  // Pending orders count - realtime updates
  const pendingOrdersCount = usePendingOrdersCount(store?.id ?? null);
  
  // Haptic feedback
  const { impactLight, selectionChanged } = useHapticFeedback();

  const sidebarTheme = useMemo(() => {
    const themeId = store?.sidebar_color || "amber";
    const classes = getMenuThemeClasses(themeId);
    const theme = MENU_THEMES.find(t => t.id === themeId);
    
    return {
      ...classes,
      theme,
      isCustom: classes.isCustom,
      customStyles: classes.isCustom && classes.customColor ? getCustomColorStyles(classes.customColor) : null
    };
  }, [store?.sidebar_color]);

  useEffect(() => {
    checkAuth();
  }, []);

  // Real-time subscription for store updates (sidebar color, etc)
  useEffect(() => {
    if (!store?.id) return;

    const channel = supabase
      .channel('store-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stores',
          filter: `id=eq.${store.id}`
        },
        (payload) => {
          // Update store state with new data instantly
          setStore(prev => prev ? { ...prev, ...payload.new } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [store?.id]);

  // Atalho de teclado para PDV (Shift+F8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'F8') {
        e.preventDefault();
        navigate('/dashboard/pdv');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setSidebarCollapsed(saved === "true");
    }
  }, []);

  // Preload all dashboard routes on mount for instant navigation
  useEffect(() => {
    preloadDashboardRoutes();
  }, []);

  // Route prefetch cache
  const prefetchedRoutes = useMemo(() => new Set<string>(), []);
  
  const prefetchRoute = useCallback((path: string) => {
    if (prefetchedRoutes.has(path)) return;
    prefetchedRoutes.add(path);
    
    // Dynamic import based on path
    const routeImports: Record<string, () => Promise<unknown>> = {
      "/dashboard": () => import("@/pages/dashboard/DashboardHome"),
      "/dashboard/pdv": () => import("@/pages/dashboard/PDVPage"),
      "/dashboard/tables": () => import("@/pages/dashboard/TablesPage"),
      "/dashboard/comandas": () => import("@/pages/dashboard/ComandaPanel"),
      "/dashboard/orders": () => import("@/pages/dashboard/OrdersPage"),
      "/dashboard/analytics": () => import("@/pages/dashboard/AnalyticsPage"),
      "/dashboard/customers": () => import("@/pages/dashboard/CustomersPage"),
      "/dashboard/products": () => import("@/pages/dashboard/MenuManagerPage"),
      "/dashboard/coupons": () => import("@/pages/dashboard/CouponsPage"),
      "/dashboard/banners": () => import("@/pages/dashboard/BannersPage"),
      "/dashboard/settings": () => import("@/pages/dashboard/SettingsPage"),
    };
    
    const loader = routeImports[path];
    if (loader) loader().catch(() => {});
  }, [prefetchedRoutes]);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const checkAuth = async () => {
    try {
      // Buscar primeira loja disponível para desenvolvimento
      const { data: storeData } = await supabase
        .from("stores")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (storeData) {
        setStore(storeData);
      }

    } catch (error) {
      console.error("Store fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado!");
    navigate("/");
  };

  // Filter menu items based on comanda mode
  const menuItems = useMemo(() => allMenuItems.filter(item => {
    if (item.requiresComandaMode) {
      return store?.use_comanda_mode !== false;
    }
    return true;
  }), [store?.use_comanda_mode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-14 bg-sidebar border-r border-sidebar-border p-2 space-y-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
        <div className="flex-1 p-5">
          <Skeleton className="h-5 w-40 mb-3" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const isTrialExpired = subscription?.status === "trial" && 
    subscription?.trial_ends_at && 
    new Date(subscription.trial_ends_at) < new Date();

  const isSubscriptionInactive = subscription?.status === "canceled" || 
    subscription?.status === "unpaid" || 
    isTrialExpired;

  const toggleMenuExpand = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleToggleStoreStatus = async (newStatus: boolean) => {
    if (!store) return;
    await supabase
      .from("stores")
      .update({ is_open_override: newStatus })
      .eq("id", store.id);
    setStore(prev => prev ? { ...prev, is_open_override: newStatus } : null);
    toast.success(newStatus ? "Loja aberta!" : "Loja fechada!");
  };

  // Track which icon was just clicked for animation

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 500);
  };

  const NavItem = ({ item }: { item: MenuItem }) => {
    const isActive = location.pathname === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.path);
    const isSubItemActive = item.subItems?.some(sub => location.pathname === sub.path);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      createRipple(e);
      if (sidebarCollapsed) {
        setAnimatingIcon(item.path);
        setTimeout(() => setAnimatingIcon(null), 400);
      }
    };

    // If has sub-items, render as expandable
    if (hasSubItems && !sidebarCollapsed) {
      return (
        <div>
          <button
            onClick={() => toggleMenuExpand(item.path)}
            className={cn(
              "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium outline-none transition-all duration-150 relative",
              (isActive || isSubItemActive)
                ? "bg-sidebar-active text-sidebar-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-500 before:rounded-full" 
                : "text-sidebar-foreground-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="flex-shrink-0 w-[18px] h-[18px]" />
            <span className="truncate flex-1 text-left">{item.label}</span>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 opacity-50 transition-transform duration-200",
              isExpanded && "rotate-180"
            )} />
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {/* Main item link */}
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-[6px] rounded-md text-[13px] transition-all duration-150 relative",
                      isActive 
                        ? "bg-sidebar-active text-sidebar-foreground font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-amber-500 before:rounded-full" 
                        : "text-sidebar-foreground-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
                    )}
                    onMouseEnter={() => prefetchRoute(item.path)}
                  >
                    <Package className="w-4 h-4" />
                    <span>Produtos</span>
                  </Link>
                  
                  {/* Sub items */}
                  {item.subItems?.map(subItem => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-[6px] rounded-md text-[13px] transition-all duration-150 relative",
                          isSubActive 
                            ? "bg-sidebar-active text-sidebar-foreground font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-amber-500 before:rounded-full" 
                            : "text-sidebar-foreground-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
                        )}
                        onMouseEnter={() => prefetchRoute(subItem.path)}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    
    const content = (
      <Link
        to={item.path}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium outline-none transition-all duration-150 relative",
          isActive 
            ? "bg-sidebar-active text-sidebar-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-500 before:rounded-full" 
            : "text-sidebar-foreground-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
          sidebarCollapsed && "justify-center px-2 before:hidden"
        )}
        onMouseEnter={() => prefetchRoute(item.path)}
        onTouchStart={() => prefetchRoute(item.path)}
      >
        <div className="relative">
          <item.icon className={cn(
            "flex-shrink-0",
            sidebarCollapsed ? "w-5 h-5" : "w-[18px] h-[18px]",
            sidebarCollapsed && animatingIcon === item.path && "animate-icon-spin",
            isActive && sidebarCollapsed && "text-amber-500"
          )} />
          {/* Badge for pending orders */}
          {item.path === "/dashboard/orders" && pendingOrdersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center",
                "bg-red-500 text-white text-[9px] font-bold rounded-full px-0.5",
                sidebarCollapsed && "-top-1 -right-1"
              )}
            >
              {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
            </motion.span>
          )}
        </div>
        {!sidebarCollapsed && (
          <span className="truncate flex-1">
            {item.label}
          </span>
        )}
      </Link>
    );

    if (sidebarCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-medium">
            {item.label}
            {hasSubItems && item.subItems && (
              <div className="mt-1 pt-1 border-t border-border/50 space-y-0.5">
                {item.subItems.map(sub => (
                  <Link 
                    key={sub.path} 
                    to={sub.path}
                    className="block text-muted-foreground hover:text-foreground py-0.5"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <div className="h-screen bg-background flex w-full overflow-hidden">
        {/* Sidebar - Desktop - Clean & Minimal */}
        <motion.aside 
          layout
          initial={false}
          animate={{ width: sidebarCollapsed ? 56 : 220 }}
          transition={{ 
            duration: 0.2, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          className={cn(
            "hidden md:flex flex-col h-screen flex-shrink-0 relative group/sidebar",
            "bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]"
          )}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "absolute -right-3 top-14 z-50 flex h-6 w-6 items-center justify-center",
              "rounded-full bg-card border border-border shadow-sm",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-all duration-150 opacity-0 group-hover/sidebar:opacity-100",
              "focus:opacity-100 focus:outline-none"
            )}
            title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>
          </button>

          {/* Logo - Compact */}
          <div 
            className={cn(
              "h-[52px] flex items-center flex-shrink-0 overflow-hidden",
              "transition-all duration-200",
              sidebarCollapsed ? "justify-center px-2" : "px-3",
              "border-b border-[hsl(var(--sidebar-border))]"
            )}
          >
            <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
              <motion.div
                layout
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                {store?.logo_url ? (
                  <img 
                    src={store.logo_url} 
                    alt={store.name} 
                    className="w-8 h-8 rounded-lg object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                    <span className="text-amber-900 font-bold text-sm">
                      {store?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
              </motion.div>
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col min-w-0"
                  >
                    <span className="font-semibold text-[13px] text-sidebar-foreground truncate">
                      {store?.name || "Anotô?"}
                    </span>
                    <span className="text-[10px] text-sidebar-foreground-muted truncate">
                      Painel de Controle
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Store Status Toggle */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (!store) return;
                  if (store.is_open_override) {
                    setShowCloseStoreDialog(true);
                  } else {
                    handleToggleStoreStatus(true);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 w-full transition-all duration-150 rounded-md mx-2 my-1",
                  sidebarCollapsed ? "justify-center p-1.5 mx-1" : "px-2 py-1.5",
                  sidebarCollapsed ? "w-auto" : "w-[calc(100%-16px)]",
                  store?.is_open_override 
                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25"
                    : "bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/15 dark:hover:bg-red-500/25"
                )}
              >
                <motion.div
                  animate={{ 
                    scale: store?.is_open_override ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: store?.is_open_override ? Infinity : 0, 
                    ease: "easeInOut"
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    store?.is_open_override 
                      ? "bg-emerald-500" 
                      : "bg-red-500"
                  )}
                />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "text-[11px] font-medium",
                        store?.is_open_override ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                      )}
                    >
                      {store?.is_open_override ? "Loja Aberta" : "Loja Fechada"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="text-xs font-medium">
                {store?.is_open_override ? "Loja Aberta" : "Loja Fechada"}
              </TooltipContent>
            )}
          </Tooltip>

          <AlertDialog open={showCloseStoreDialog} onOpenChange={setShowCloseStoreDialog}>
            <AlertDialogContent className="max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base">Fechar a loja?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs">
                  Ao fechar a loja, os clientes não poderão fazer novos pedidos até que você abra novamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-8 text-xs">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleToggleStoreStatus(false)}
                  className="h-8 text-xs bg-destructive hover:bg-destructive/90"
                >
                  Fechar loja
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Menu - Scrollable */}
          <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {menuItems.map(item => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Footer - Fixed Bottom */}
          <div 
            className={cn(
              "px-2 py-2 space-y-0.5 flex-shrink-0 overflow-hidden",
              sidebarCollapsed && "flex flex-col items-center px-1",
              "border-t border-[hsl(var(--sidebar-border))]"
            )}
          >
            {/* Theme Toggle */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggle variant="sidebar" collapsed={sidebarCollapsed} />
                </div>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right" className="text-xs font-medium">Tema</TooltipContent>
              )}
            </Tooltip>

            {/* Store Link */}
            {store && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={`/cardapio/${store.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2 text-[13px] text-sidebar-foreground-muted hover:text-sidebar-foreground transition-all duration-150 rounded-md hover:bg-sidebar-hover",
                      sidebarCollapsed ? "p-1.5 justify-center" : "px-2 py-[6px]"
                    )}
                  >
                    <ExternalLink className="w-[18px] h-[18px] flex-shrink-0 opacity-70" />
                    <AnimatePresence mode="wait">
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Ver cardápio
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </a>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right" className="text-xs font-medium">Ver cardápio</TooltipContent>
                )}
              </Tooltip>
            )}

            {/* Logout */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={cn(
                    "flex items-center gap-2 text-[13px] text-sidebar-foreground-muted hover:text-red-500 transition-all duration-150 w-full rounded-md hover:bg-red-500/10",
                    sidebarCollapsed ? "p-1.5 justify-center" : "px-2 py-[6px]"
                  )}
                >
                  <LogOut className="w-[18px] h-[18px] flex-shrink-0 opacity-70" />
                  <AnimatePresence mode="wait">
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Sair
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right" className="text-xs font-medium">Sair</TooltipContent>
              )}
            </Tooltip>
          </div>
        </motion.aside>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--sidebar-bg))] border-t border-[hsl(var(--sidebar-border))] safe-bottom">
          {/* Store Status Indicator */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <button
              onClick={() => {
                if (!store) return;
                if (store.is_open_override) {
                  setShowCloseStoreDialog(true);
                } else {
                  handleToggleStoreStatus(true);
                }
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium shadow-lg transition-all",
                store?.is_open_override 
                  ? "bg-emerald-500 text-white" 
                  : "bg-red-500 text-white"
              )}
            >
              <motion.div
                animate={{ scale: store?.is_open_override ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 1.5, repeat: store?.is_open_override ? Infinity : 0 }}
                className="w-1.5 h-1.5 rounded-full bg-white"
              />
              {store?.is_open_override ? "Aberta" : "Fechada"}
            </button>
          </div>
          
          <div className="flex items-center justify-around h-16 px-1">
            {mobileNavItems.map((item) => {
              const isActive = item.path === "more" 
                ? sidebarOpen 
                : location.pathname === item.path;
              const isOrdersWithBadge = item.path === "/dashboard/orders" && pendingOrdersCount > 0;
              
              if (item.path === "more") {
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      impactLight();
                      setSidebarOpen(true);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-150 min-w-[60px]",
                      isActive 
                        ? "text-amber-500" 
                        : "text-sidebar-foreground-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => selectionChanged()}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-150 min-w-[60px] relative",
                    isActive 
                      ? "text-amber-500 bg-amber-500/10" 
                      : "text-sidebar-foreground-muted"
                  )}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {isOrdersWithBadge && (
                      <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-0.5">
                        {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Full Menu Sheet */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--sidebar-bg))] z-50 rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
              >
                {/* Handle */}
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-10 h-1 rounded-full bg-sidebar-foreground-muted/30" />
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--sidebar-border))]">
                  <div className="flex items-center gap-2">
                    {store?.logo_url ? (
                      <img src={store.logo_url} alt={store.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                        <span className="text-amber-900 font-bold text-sm">{store?.name?.charAt(0) || "A"}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-sidebar-foreground">{store?.name || "Anotô?"}</p>
                      <p className="text-[10px] text-sidebar-foreground-muted">Painel de Controle</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-sidebar-hover transition-colors"
                  >
                    <X className="w-5 h-5 text-sidebar-foreground-muted" />
                  </button>
                </div>
                
                {/* Menu Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-4 gap-3">
                    {menuItems.map(item => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => {
                            selectionChanged();
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-150",
                            isActive 
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" 
                              : "text-sidebar-foreground-muted hover:bg-sidebar-hover"
                          )}
                        >
                          <item.icon className="w-6 h-6" />
                          <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="border-t border-[hsl(var(--sidebar-border))] p-4 flex items-center justify-between safe-bottom">
                  <div className="flex items-center gap-3">
                    <ThemeToggle variant="simple" />
                    {store && (
                      <a
                        href={`/cardapio/${store.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-sidebar-foreground-muted hover:text-sidebar-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Ver cardápio</span>
                      </a>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content - Independent Scroll */}
        <main className="flex-1 h-screen overflow-y-auto bg-background relative pb-20 md:pb-0">
          {/* Quick Action Buttons - Top Right */}
          <QuickActionButtons 
            store={store} 
            onStoreUpdate={(updates) => setStore(prev => prev ? { ...prev, ...updates } : null)} 
          />

          <div className="p-3 pt-4 md:p-5 md:pt-5">
            {/* Trial/Subscription Warning */}
            {isSubscriptionInactive && location.pathname !== "/dashboard/subscription" && (
              <div className="mb-4 p-2.5 bg-destructive/10 border border-destructive/20 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-destructive text-[13px]">
                    {isTrialExpired ? "Período de teste expirou" : "Assinatura inativa"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Renove para continuar usando
                  </p>
                </div>
                <Button asChild size="sm" variant="destructive" className="h-7 text-xs">
                  <Link to="/dashboard/subscription">Renovar</Link>
                </Button>
              </div>
            )}

            {/* Page Content with Transition */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet context={{ store, subscription, refreshStore: checkAuth }} />
            </motion.div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
