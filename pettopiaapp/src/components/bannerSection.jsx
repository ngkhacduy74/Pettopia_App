import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import header1 from '../img/header1.jpg';
import header2 from '../img/header2.jpg';
import header3 from '../img/header3.jpg';
import logo from '../img/logo.png';

function BannerSection({ onBookNow = () => {}, onLearnMore = () => {} }) {
  const slides = [header1, header2, header3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = {
    name: 'Quý khách hàng',
    points: 0,
    tier: 'Chưa đăng nhập'
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <Box className="relative overflow-hidden shadow-lg" style={{ minHeight: '280px' }}>
      {/* Slides */}
      {slides.map((src, index) => (
        <Box
          key={index}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(13, 148, 136, 0.75), rgba(6, 182, 212, 0.7)), url(${src})`,
            opacity: index === currentIndex ? 1 : 0
          }}
        />
      ))}

      {/* Dots */}
      <Box className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${index === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
          />
        ))}
      </Box>

      {/* Decorative elements - smaller */}
      <Box className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mt-12" />
      <Box className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -ml-10 -mb-10" />

      {/* Content */}
      <Box className="relative z-10 px-4" style={{ paddingTop: 'calc(1.25rem + 35px)', paddingBottom: '1.25rem' }}>
        {/* Mock user summary */}
        <Box className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 mb-3 flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Box className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center">
              <img src={logo} alt="avatar" className="w-7 h-7 object-contain" />
            </Box>
            <Box>
              <Text className="text-white font-semibold">{user.name}</Text>
              <Text size="xxSmall" className="text-cyan-50">Điểm thưởng: {user.points}đ</Text>
            </Box>
          </Box>
          <Box className="flex items-center gap-2">
            <Icon icon="zi-badge" className="text-amber-300" size={16} />
            <Text size="xxSmall" className="text-white">{user.tier}</Text>
          </Box>
        </Box>

        {/* CTA Buttons - smaller */}
        <Box className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onBookNow}
            className="flex-1 text-sm"
            size="small"
          >
            Đăng nhập
          </Button>
          <Button
            onClick={onLearnMore}
            className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm text-white border-white border text-sm"
            size="small"
          >
            Tìm hiểu thêm
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// Example usage component
function Banner() {
  return (
    <BannerSection />
  );
}

export default Banner;