import React from 'react';
import { Page, Box, Text, Icon, Button } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { mockPets, Pet } from '@/data/mockPets';
import petIconHover from '../img/icon/pawprint-gray.png';

function PetListPage() {
  const navigate = useNavigate();

  const handlePetClick = (pet: Pet) => {
    navigate(`/pets/${pet.id}`);
  };

  const calculateAge = (dateOfBirth: string): string => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years > 0) {
      return `${years} tuổi`;
    } else if (months > 0) {
      return `${months} tháng`;
    } else {
      return 'Chưa đầy tháng';
    }
  };

  return (
    <Page className="bg-gray-50 pb-20">
      {/* Header */}
      <Box className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-6 shadow-md">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-3">
            <Box onClick={() => navigate('/')} className="cursor-pointer">
              <Icon icon="zi-arrow-left" className="text-white text-xl" />
            </Box>
            <Text.Title size="large" className="text-white font-bold">
              Danh sách thú cưng
            </Text.Title>
          </Box>
        </Box>
      </Box>

      {/* Pet List */}
      <Box className="px-4 py-6">
        {mockPets.length === 0 ? (
          <Box className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <Text.Title className="text-gray-900 mb-2">Chưa có thú cưng nào</Text.Title>
            <Text className="text-gray-600 mb-6">Hãy thêm thú cưng đầu tiên của bạn!</Text>
            <Button
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
              onClick={() => console.log('Add pet')}
            >
              + Thêm thú cưng
            </Button>
          </Box>
        ) : (
          <Box className="space-y-4">
            {mockPets.map((pet) => (
              <Box
                key={pet.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:bg-gray-50"
                onClick={() => handlePetClick(pet)}
              >
                <Box className="flex gap-4 p-4">
                  {/* Pet Avatar */}
                  <Box className="flex-shrink-0">
                    <img
                      src={pet.avatar_url}
                      alt={pet.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  </Box>

                  {/* Pet Info */}
                  <Box className="flex-1 min-w-0">
                    <Box className="flex items-start justify-between mb-2">
                      <Text.Title size="small" className="text-gray-900 font-bold">
                        {pet.name}
                      </Text.Title>
                      <Box className="flex items-center gap-1">
                        {pet.species === 'Dog' ? (
                          <span className="text-2xl">🐶</span>
                        ) : pet.species === 'Cat' ? (
                          <span className="text-2xl">🐱</span>
                        ) : (
                          <span className="text-2xl">🐾</span>
                        )}
                      </Box>
                    </Box>

                    <Box className="space-y-1">
                      <Box className="flex items-center gap-2">
                        <Text size="small" className="text-gray-600">
                          {pet.breed}
                        </Text>
                        <span className="text-gray-400">•</span>
                        <Text size="small" className="text-gray-600">
                          {pet.gender === 'Male' ? 'Đực' : 'Cái'}
                        </Text>
                      </Box>
                      
                      <Box className="flex items-center gap-4">
                        <Text size="xSmall" className="text-gray-500">
                          🎂 {calculateAge(pet.dateOfBirth)}
                        </Text>
                        <Text size="xSmall" className="text-gray-500">
                          ⚖️ {pet.weight} kg
                        </Text>
                      </Box>

                      <Box className="flex items-center gap-1">
                        <Text size="xSmall" className="text-gray-500">
                          🎨 {pet.color}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Arrow */}
                  <Box className="flex-shrink-0 flex items-center">
                    <Icon icon="zi-chevron-right" className="text-gray-400" />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Floating Action Button */}
      <Box className="fixed bottom-24 right-4 z-40">
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg flex items-center justify-center p-0"
          onClick={() => console.log('Add pet')}
        >
          <Icon icon="zi-plus" className="text-white text-2xl" />
        </Button>
      </Box>

      {/* Bottom Navigation */}
      <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <Box className="grid grid-cols-4 text-center py-2">
          <Box className="flex flex-col items-center text-gray-500" onClick={() => navigate('/')}>
            <Icon icon="zi-home" />
            <Text size="xxSmall">Trang chủ</Text>
          </Box>
          <Box className="flex flex-col items-center text-gray-500" onClick={() => navigate('/search')}>
            <Icon icon="zi-search" />
            <Text size="xxSmall">Tìm kiếm</Text>
          </Box>
          <Box className="flex flex-col items-center text-teal-600">
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

export default PetListPage;

