import { Link, useLocation, Outlet } from 'react-router-dom';
import { Activity, Network, Target, LayoutDashboard, ShieldCheck, Database, Settings, Search, Info, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Command Center', path: '/command-center', icon: LayoutDashboard },
    { name: 'Razorpay Test', path: '/razorpay', icon: Database },
    { name: 'Networks', path: '/networks', icon: Network },
    { name: 'Investigations', path: '/investigations', icon: Target },
    { name: 'Entities', path: '/entities', icon: Database },
    { name: 'Analytics', path: '/analytics', icon: Activity },
    { name: 'Audit Logs', path: '/audit', icon: ShieldCheck },
  ];

  const currentPage = navItems.concat([
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'About', path: '/about', icon: Info },
  ]).find(i => location.pathname.startsWith(i.path))?.name || 'SENTINEL AI';

  return (
    <div className="flex h-screen w-full bg-[#f5f5f7] text-[#1d1d1f] overflow-hidden">
      <aside className="w-60 bg-white border-r border-[#d2d2d7] flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-[#d2d2d7]">
          <Link to="/" className="flex items-center gap-2 group">
            <ChevronLeft size={14} className="text-[#aeaeb2] group-hover:text-[#0071e3] transition-colors" />
            <span className="font-bold text-[16px] tracking-tight text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
              SENTINEL <span className="text-[#6e6e73] font-normal">AI</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          <div>
            <p className="text-[10px] font-semibold text-[#aeaeb2] mb-1.5 px-3 uppercase tracking-widest">Risk Intelligence</p>
            <nav className="space-y-0.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/command-center' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all',
                      isActive
                        ? 'bg-[#0071e3] text-white'
                        : 'text-[#424245] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                    )}
                  >
                    <Icon size={15} className={isActive ? 'text-white' : 'text-[#aeaeb2]'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-[#aeaeb2] mb-1.5 px-3 uppercase tracking-widest">System</p>
            <nav className="space-y-0.5">
              {[{ name: 'Settings', path: '/settings', icon: Settings }, { name: 'About', path: '/about', icon: Info }].map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.name} to={item.path}
                    className={clsx('flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all',
                      isActive ? 'bg-[#0071e3] text-white' : 'text-[#424245] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]')}
                  >
                    <Icon size={15} className={isActive ? 'text-white' : 'text-[#aeaeb2]'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-[#d2d2d7]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[11px] font-bold shrink-0">AD</div>
            <div>
              <p className="text-[12px] font-semibold text-[#1d1d1f]">Admin Analyst</p>
              <p className="text-[11px] text-[#34c759] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse inline-block" />
                System Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-[#d2d2d7] flex items-center justify-between px-6 shrink-0">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">{currentPage}</h2>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[13px] py-1.5 pl-8 pr-3 text-[#1d1d1f] w-52 focus:outline-none focus:border-[#0071e3] placeholder:text-[#aeaeb2] transition-colors"
              />
            </div>
            <span className="text-[11px] text-[#aeaeb2] bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg px-2 py-1 font-mono">v1.0.0-rc</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#f5f5f7]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
