import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  FileJson,
  Scissors,
  CheckCircle,
  Upload,
  Image,
  Key,
  Wand2
} from "lucide-react";

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  const navClass =
    "flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition";

  const activeClass = "bg-green-500 text-black";

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 p-3 flex justify-between items-center z-50">
        <h2 className="font-bold">Dev Tools</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 p-4 space-y-3 transform ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition duration-300 z-40`}
      >
        <h2 className="text-xl font-bold mb-4 hidden md:block">
          🚀 Dev Tools Hub
        </h2>

        <NavLink
          to="/json-formatter"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <FileJson size={18} /> JSON Formatter
        </NavLink>

        <NavLink
          to="/minify"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <Scissors size={18} /> JSON Minifier
        </NavLink>

        <NavLink
          to="/validator"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <CheckCircle size={18} /> JSON Validator
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <Upload size={18} /> Upload JSON
        </NavLink>

        <NavLink
          to="/bg-remove"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <Image size={18} /> BG Remove
        </NavLink>

        <NavLink
          to="/password-generator"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <Key size={18} /> Password Generator
        </NavLink>

        <NavLink
          to="/advance-image-editor"
          className={({ isActive }) =>
            `${navClass} ${isActive ? activeClass : ""}`
          }
        >
          <Wand2 size={18} /> Image Editor
        </NavLink>
        <div className="mt-6 text-s text-gray-400">
          Free tools for developers 🚀
        </div>
      </div>


      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto mt-12 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
}









// import { Link, Outlet } from "react-router-dom";

// import AdBanner from "./AdBanner";

// export default function SideMenu() {
//     return (
//         <div className="flex h-screen bg-gray-900 text-white">

//             {/* Sidebar */}
//             <div className="w-64 bg-gray-800 p-4 space-y-4">
//                 <h2 className="text-xl font-bold mb-4">JSON Tools</h2>

//                 <Link to="/json-formatter" className="block hover:text-green-400">JSON Formatter & Beautifier</Link>
//                 <Link to="/minify" className="block hover:text-green-400">JSON Minifier</Link>
//                 <Link to="/validator" className="block hover:text-green-400">JSON Validator</Link>
//                 <Link to="/upload" className="block hover:text-green-400">Upload JSON</Link>
//                 <Link to="/bg-remove" className="block hover:text-green-400">BG Remove</Link>
//                 <Link to="/password-generator" className="block hover:text-green-400">Password generator</Link>
//                 <Link to="/advance-image-editor" className="block hover:text-green-400">Advance Image Editor</Link>
//             </div>

//             {/* <div className="mt-6">
//                 <h1>AdBanner</h1>
//                 <AdBanner />
//             </div> */}

//             {/* Content */}
//             <div className="flex-1 p-4 overflow-auto">
//                 <Outlet />
//             </div>
//         </div>
//     );
// }