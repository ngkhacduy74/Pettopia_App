import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import logoCard from '../img/logo-card.png';
import petCard from '../img/petcard.png';

function SuggestionCard({ title, subtitle, image, onClick }) {
  return (
    <Box className="min-w-[220px] w-[220px] bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
      <Box className="h-28 bg-gradient-to-r from-teal-500 to-cyan-500 relative">
        <img src={image} alt={title} className="absolute right-2 -bottom-6 w-24 h-24 object-contain" />
      </Box>
      <Box className="p-4">
        <Text className="font-semibold text-gray-900 mb-1">{title}</Text>
        <Text size="xSmall" className="text-gray-600 mb-3">{subtitle}</Text>
        <Button size="small" className="w-full" onClick={onClick}>Khám phá</Button>
      </Box>
    </Box>
  );
}

/**
 * @param {{
 *  title?: string,
 *  items?: Array<{ title: string; subtitle: string; image: string; onClick?: () => void }>
 * }} props
 */
function SuggestionSection(props) {
  const { title = 'Gợi ý cho bạn', items = [] } = props;
  const defaultItems = [
    { title: 'Dịch vụ Spa', subtitle: 'Tắm gội, tỉa lông', image: logoCard },
    { title: 'Thức ăn thú cưng', subtitle: 'Sức khỏe mỗi ngày', image: petCard },
    { title: 'Phụ kiện', subtitle: 'Vòng cổ, đồ chơi', image: logoCard },
  ];

  const list = items.length ? items : defaultItems;

  return (
    <Box className="px-4 mt-6">
      <Text.Title size="large" className="font-bold mb-4">{title}</Text.Title>
      <Box className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {list.map((it, idx) => (
          <SuggestionCard key={idx} {...it} />
        ))}
      </Box>
    </Box>
  );
}

export default SuggestionSection;

