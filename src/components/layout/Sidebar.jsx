import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Newspaper, BarChart3 } from 'lucide-react';

export default function Sidebar() {
    const links = [
        { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'แดชบอร์ด', end: true },
        { to: '/admin/bookings', icon: <CalendarDays size={18} />, label: 'จัดการการจอง' },
        { to: '/admin/news', icon: <Newspaper size={18} />, label: 'จัดการข่าวสาร' },
        { to: '/admin/stats', icon: <BarChart3 size={18} />, label: 'สถิติ' },
    ];

    return (
        <aside className="sidebar">
            <h3 className="sidebar-title">เมนูจัดการ</h3>
            <ul className="sidebar-links">
                {links.map(link => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
