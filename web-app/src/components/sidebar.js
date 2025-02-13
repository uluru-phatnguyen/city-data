import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route.link;
  const routes = [
    {
      name: "Water supply",
      link: "/water-supply",
    },
    {
      name: "Electricity",
      link: "/electricity",
    },
    {
      name: "Waste",
      link: "/waste",
    },
  ];
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">CITY DATA</div>
      <hr className="border-t border-gray-700" />
      <nav className="flex-1 p-4">
        <ul>
          {routes.map((route, index) => (
            <li className="mb-2" key={index}>
              <Link href={route.link}>
                <a
                  className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
                    isActive(route) ? "bg-gray-700" : ""
                  }`}
                >
                  {route.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
