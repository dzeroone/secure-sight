import { Link } from "react-router-dom";
import { DASHBOARD_SAVED_REPORTS } from "../constants/routeConstants";
import { useAuth } from "../providers/AuthProvider";

const Navbar = () => {
  const { currentUser, signout } = useAuth();
  return (
    <nav>
      <div className="brand">
        <span>Automated Report Generation</span>
      </div>
      <div className="hamburger-menu">
        <button>
          <svg
            className="h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link
            to="/dashboard"
            className="block mt-4 lg:inline-block lg:mt-0 py-1 px-2 border rounded-lg text-white transition-all hover:bg-white hover:text-green-800 mr-4"
          >
            Home
          </Link>
          <Link
            to={DASHBOARD_SAVED_REPORTS}
            className="block mt-4 lg:inline-block lg:mt-0 py-1 px-2 border rounded-lg text-white transition-all hover:bg-white hover:text-green-800 mr-4"
          >
            Saved reports
          </Link>

          {/* <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white"
          >
            Blog
          </a> */}
        </div>
        <div className="flex flex-row items-center gap-1 ml-auto">
          {currentUser ? (
            <span className="text-white">{currentUser?.email}</span>
          ) : null}
          <button
            onClick={signout}
            className="block mt-4 lg:inline-block lg:mt-0 py-1 px-2 border rounded-lg text-white transition-all hover:bg-white hover:text-green-800 mr-4"
          >
            Signout
          </button>
        </div>
        {/* <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 lg:mt-0"
          >
            Logout
          </a>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
