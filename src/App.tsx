import { BrowserRouter, Routes, Route } from "react-router-dom";

import SideMenu from "./components/SideMenu";
import Beautify from "./website/pages/Beautify";
import Minify from "./website/pages/Minify";
import Validator from "./website/pages/Validator";
import Upload from "./website/pages/Upload";
import BgRemove from "./website/pages/BgRemove";
import PasswordGenerator from "./website/pages/PasswordGenerator";
import AdvanceImageEditor from "./website/pages/AdvancedImageCropper";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SideMenu />}>
          <Route path="/" element={<Beautify />} />
          <Route path="/json-formatter" element={<Beautify />} />
          <Route path="/json-beautify" element={<Beautify />} />
          <Route path="/minify" element={<Minify />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/bg-remove" element={<BgRemove />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/advance-image-editor" element={<AdvanceImageEditor />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}