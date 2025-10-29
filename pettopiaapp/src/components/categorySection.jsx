import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';

/**
 * @param {{
 *  title?: string,
 *  categories?: Array<{ icon: string; label: string; img?: string }>
 * }} props
 */
function CategorySection(props) {
  const { title = 'Danh mục dịch vụ thú cưng', categories = [] } = props;


  const list = categories.length ? categories : defaultCategories;

  return (
    <Box className="px-4 mt-6">
      <Text.Title size="large" className="font-bold mb-4">{title}</Text.Title>
      <Box className="grid grid-cols-4 gap-5">
        {list.map((c, idx) => (
          <Box key={idx} className="flex flex-col items-center gap-2">
            <Box className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center shadow">
              {c.img ? (
                <img src={c.img} alt={c.label} className="w-6 h-6" />
              ) : (
                <Icon icon={c.icon} className="text-teal-600 text-xl" />
              )}
            </Box>
            <Text size="xSmall" className="text-gray-800 text-center">{c.label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default CategorySection;

