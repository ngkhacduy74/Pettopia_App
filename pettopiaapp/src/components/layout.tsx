import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  ZMPRouter,
  Box,
} from "zmp-ui";
import { useState, useEffect } from "react";

import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import PetListPage from "@/pages/PetList";
import PetDetailPage from "@/pages/PetDetail";
import CommunityPage from "@/pages/Community";
import CommunityCreatePage from "@/pages/CommunityCreate";
import CommunityDetailPage from "@/pages/CommunityDetail";
import CommunityHistoryPage from "@/pages/CommunityHistory";
import logo from "../img/logo.png";

const Layout = () => {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hiện header khi scroll xuống hơn 100px
      if (window.scrollY > 100) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      {/* Fixed gradient header with logo - show/hide on scroll */}
      <Box 
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(13,148,136,1), rgba(6,182,212,1))',
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <Box className="h-14 px-4 flex items-center shadow-md">
          <img src={logo} alt="Pettopia" className="w-10 h-10 object-contain" />
        </Box>
      </Box>
      
      {/* Content - no padding needed since header is hidden initially */}
      <Box>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/pets" element={<PetListPage />}></Route>
            <Route path="/pets/:id" element={<PetDetailPage />}></Route>
            <Route path="/community" element={<CommunityPage />}></Route>
            <Route path="/community/create" element={<CommunityCreatePage />}></Route>
            <Route path="/community/detail/:id" element={<CommunityDetailPage />}></Route>
            <Route path="/community/history" element={<CommunityHistoryPage />}></Route>
          </AnimationRoutes>
        </ZMPRouter>
      </Box>
    </App>
  );
};

export default Layout;