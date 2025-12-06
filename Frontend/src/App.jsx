import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllPrograms from "./pages/AllPrograms";
import OurStory from "./pages/OurStory";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import BlogDetails from "./pages/BlogDetails";
import ProgramDetails from "./components/AllPrograms/ProgramDetails";
import { useState } from "react";


function App() {
  const [videoVisible, setVideoVisible] = useState(true);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <Header videoVisible={videoVisible} />
        </header>
        <main className="grow">
          <Routes>
            <Route
              path="/"
              element={<Home onVideoVisible={setVideoVisible} />}
            />
            <Route path="/programs" element={<AllPrograms />} />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route path="/ourstory" element={<OurStory />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:blogId" element={<BlogDetails />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default App;
