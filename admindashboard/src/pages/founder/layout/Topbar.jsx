import { Bell, Settings, ChevronRight } from "lucide-react";
import { assets } from "../../../assets/asset";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar() {

  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    

    const filteredSegments = pathSegments.filter(segment => 
      !['founder', 'admin', 'client', 'expert', 'head'].includes(segment.toLowerCase())
    );

    const breadcrumbs = [{ name: 'Dashboard', path: `/${pathSegments[0] || 'founder'}` }];
    
    let currentPath = `/${pathSegments[0] || 'founder'}`;
    filteredSegments.forEach((segment) => {
      currentPath += `/${segment}`;

      const formattedName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ name: formattedName, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.name || 'Dashboard';

  return (
    <div className="flex justify-between items-center  ">
      <div>
        <h2 className="text-2xl font-semibold text-[#0A4F48] mb-1">{currentPage}</h2>
        {breadcrumbs.length > 1 && (
          <div className="flex items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-400">/</span>}
                <span
                  className="text-sm text-gray-500 cursor-pointer hover:text-[#0A4F48] transition-colors"
                  onClick={() => navigate(breadcrumb.path)}
                >
                  {breadcrumb.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="flex items-center bg-white px-3 rounded-lg">
          <img src={assets.search} className="  w-5 h-5  " />
          <input
            type="text"
            placeholder="Search anything"
            className="  px-2.5 py-3 border border-none rounded-xl bg-white w-[250px]"
          />
          <img src={assets.filter} className="  w-4 h-4" />
        </div> */}

        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <img src={assets.menu} />
        
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/founder/profile')}
        >
          <img src={assets.profile} className=" rounded-full" />
          <div>
            <p className="text-[18px] font-bold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
