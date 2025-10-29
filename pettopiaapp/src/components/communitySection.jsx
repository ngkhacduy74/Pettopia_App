import React from 'react';
import { Box, Text } from 'zmp-ui';
import catGif from '../img/cat.gif';

function Testimonial({ name, role, review }) {
  return (
    <Box className="bg-white rounded-2xl shadow border border-gray-100 p-4 min-w-[260px] w-[260px]">
      <Box className="flex items-center gap-3 mb-3">
        <img src={catGif} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <Box>
          <Text className="font-semibold text-gray-900">{name}</Text>
          <Text size="xSmall" className="text-gray-600">{role}</Text>
        </Box>
      </Box>
      <Text size="small" className="text-gray-700">{review}</Text>
    </Box>
  );
}

/**
 * @param {{
 *  title?: string,
 *  testimonials?: Array<{ name: string; role: string; review: string }>
 * }} props
 */
function CommunitySection(props) {
  const { title = 'Cộng đồng Pettopia', testimonials = [] } = props;
  const defaultTestimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Dog Owner',
      review:
        'Đội ngũ Pettopia thật tuyệt! Họ chăm sóc chú chó Max của chúng tôi rất chu đáo.',
    },
    {
      name: 'Michael Thompson',
      role: 'Cat Owner',
      review:
        'Tôi đưa mèo đến Pettopia nhiều năm. Bác sĩ rất nhẹ nhàng và tận tâm.',
    },
    {
      name: 'Emily Wilson',
      role: 'Rabbit Owner',
      review:
        'Khi thỏ của chúng tôi cần cấp cứu, Pettopia đã kết nối với phòng khám đối tác ngay.',
    },
  ];

  const list = testimonials.length ? testimonials : defaultTestimonials;

  return (
    <Box className="px-4 mt-6">
      <Text.Title size="large" className="font-bold mb-4">{title}</Text.Title>
      <Box className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {list.map((t, idx) => (
          <Testimonial key={idx} {...t} />
        ))}
      </Box>
    </Box>
  );
}

export default CommunitySection;

