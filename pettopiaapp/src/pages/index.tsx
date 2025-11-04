import React from 'react';
import { Page, Box, Text, Button, Icon } from 'zmp-ui';
import Banner from '../components/bannerSection';
import { useNavigate } from 'react-router-dom';
import petIcon from '../img/icon/pawprint.png';
import scheduleIcon from '../img/icon/schedule.png';
import historyIcon from '../img/icon/clock.png';
import audienceIcon from '../img/icon/audience.png';
import pet2Icon from '../img/icon/pets.png';
import petIconHover from '../img/icon/pawprint-gray.png';

import CategorySection from '@/components/categorySection';
import SuggestionSection from '@/components/suggestionSection';
import CommunitySection from '@/components/communitySection';



function HomePage() {
  const navigate = useNavigate();

  type QuickAction = { icon: any; label: string; img?: string };
  type Category = { icon: string; label: string; img?: string };

  const quickActions: QuickAction[] = [
    { icon: 'zi-chat', label: 'Giao tiếp', img: audienceIcon },
    { icon: 'zi-list-2' as any, label: 'Thú cưng', img: pet2Icon },
    { icon: 'zi-calendar' as any, label: 'Lịch khám', img: scheduleIcon },
    { icon: 'zi-clock-1', label: 'Lịch sử', img: historyIcon },
  ];

  const categories: Category[] = [
    { icon: 'zi-heart', label: 'Tắm & Chăm sóc lông' },        // Chăm sóc yêu thương
    { icon: 'zi-edit', label: 'Cắt tỉa lông' },               // Chỉnh sửa lông
    { icon: 'zi-home', label: 'Giữ thú cưng tại nhà' },        // Ở nhà
    { icon: 'zi-location', label: 'Đưa đón thú cưng' },        // Vị trí, di chuyển
    { icon: 'zi-heart-solid', label: 'Khám sức khỏe' },        // Tim khỏe mạnh
    { icon: 'zi-star', label: 'Huấn luyện hành vi' },          // Huấn luyện tốt
    { icon: 'zi-camera', label: 'Chụp ảnh thú cưng' },         // Nhiếp ảnh
    { icon: 'zi-star-solid', label: 'Spa & Thư giãn' },
  ];
  // Nếu kết nối community sang trang này
  // const testimonials = [
  //   {
  //     name: "Sarah Johnson",
  //     role: "Dog Owner",
  //     review: "The team at Pettopia is amazing! They took such good care of our dog Max during his surgery."
  //   },
  //   {
  //     name: "Michael Thompson",
  //     role: "Cat Owner",
  //     review: "I've been bringing my cats to Pettopia for years. Dr. Martinez is so gentle with them."
  //   },
  //   {
  //     name: "Emily Wilson",
  //     role: "Rabbit Owner",
  //     review: "When our rabbit needed emergency care, Pettopia connected us with their emergency partner clinic."
  //   }
  // ];

  return (
    <Page className="bg-white pb-20">
      {/* Top slider */}
      <Box className="relative">
        <Banner />
        {/* Overlapping quick actions card */}
        <Box className="absolute left-0 right-0 -bottom-10 z-20 px-4">
          <Box className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <Box className="grid grid-cols-4 gap-3">
              {quickActions.map((item, i) => (
                <Box 
                  key={i} 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    if (item.label === 'Giao tiếp') navigate('/community');
                    else if (item.label === 'Thú cưng') navigate('/pets');
                    else if (item.label === 'Lịch khám') navigate('/booking');
                    else if (item.label === 'Lịch sử') navigate('/community/history');
                  }}
                >
                  <Box className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-2">
                    {item.img ? (
                      <img src={item.img} alt={item.label} className="w-5 h-5" />
                    ) : item.label === 'Thú cưng' ? (
                      <img src={petIcon} alt="Thú cưng" className="w-5 h-5" />
                    ) : (
                      <Icon icon={item.icon as any} className="text-teal-600 text-xl" />
                    )}
                  </Box>
                  <Text size="xSmall" className="text-gray-900 text-center whitespace-pre-line">{item.label}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Space under overlapping card */}
      <Box className="h-16" />

      {/* Promo banner */}
      <Box className="px-4 mt-4">
        <Box className="bg-green-100 rounded-2xl p-4 flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Box className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Icon icon={"zi-notif-ring" as any} className="text-green-600" />
            </Box>
            <Box>
              <Text className="text-gray-800 font-medium">Bạn đang có 2 ưu đãi</Text>
              <Text size="xSmall" className="text-gray-600">Mua hàng để tận hưởng ưu đãi ngay bạn nhé!</Text>
            </Box>
          </Box>
          <Icon icon="zi-chevron-right" className="text-gray-500" />
        </Box>
      </Box>

      {/* Categories */}
      <CategorySection categories={categories} />

      {/* Community Section */}
      <CommunitySection />

      {/* Suggestion Section */}
      <SuggestionSection />

      {/* Bottom Nav */}
      <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <Box className="grid grid-cols-4 text-center py-2">
          <Box className="flex flex-col items-center text-teal-600">
            <Icon icon="zi-home" />
            <Text size="xxSmall">Trang chủ</Text>
          </Box>
          <Box className="flex flex-col items-center text-gray-500" onClick={() => navigate('/search')}>
            <Icon icon="zi-search" />
            <Text size="xxSmall">Tìm kiếm</Text>
          </Box>
          <Box className="flex flex-col items-center text-gray-500" onClick={() => navigate('/pets')}>
            <img src={petIconHover} alt="Thú cưng" className="w-5 h-5" />
            <Text size="xxSmall">Thú cưng</Text>
          </Box>
          <Box className="flex flex-col items-center text-gray-500" onClick={() => navigate('/account')}>
            <Icon icon="zi-user" />
            <Text size="xxSmall">Cá nhân</Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default HomePage;