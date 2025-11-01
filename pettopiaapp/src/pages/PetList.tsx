import React, { useState } from 'react';
import { Page, Box, Text, Icon, Sheet, Button } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { mockPets, Pet } from '@/data/mockPets';
import petIconHover from '../img/icon/pawprint-gray.png';

function PetListPage() {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetDetail, setShowPetDetail] = useState(false);

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetDetail(true);
  };

  const handleEditPet = (pet: Pet) => {
    // Navigate to edit page (to be implemented)
    console.log('Edit pet:', pet.id);
  };

  const handleDeletePet = (pet: Pet) => {
    // Handle delete (to be implemented)
    console.log('Delete pet:', pet.id);
    setShowPetDetail(false);
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

      {/* Pet Detail Sheet */}
      {selectedPet && (
        <Sheet
          visible={showPetDetail}
          onClose={() => setShowPetDetail(false)}
          title={`Thông tin ${selectedPet.name}`}
          height="80%"
        >
          <Box className="px-4 py-6 space-y-6">
            {/* Pet Avatar */}
            <Box className="flex justify-center">
              <img
                src={selectedPet.avatar_url}
                alt={selectedPet.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-100"
              />
            </Box>

            {/* Basic Info */}
            <Box>
              <Text.Title size="small" className="text-gray-900 mb-4 text-center">
                {selectedPet.name}
              </Text.Title>
              
              <Box className="space-y-3">
                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Text className="text-xl">
                      {selectedPet.species === 'Dog' ? '🐶' : selectedPet.species === 'Cat' ? '🐱' : '🐾'}
                    </Text>
                  </Box>
                  <Box className="flex-1">
                    <Text size="xSmall" className="text-gray-500">Loài</Text>
                    <Text size="small" className="text-gray-900 font-medium">{selectedPet.species}</Text>
                  </Box>
                </Box>

                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Icon icon="zi-heart-solid" className="text-teal-600" />
                  </Box>
                  <Box className="flex-1">
                    <Text size="xSmall" className="text-gray-500">Giống</Text>
                    <Text size="small" className="text-gray-900 font-medium">{selectedPet.breed}</Text>
                  </Box>
                </Box>

                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Icon icon="zi-user" className="text-teal-600" />
                  </Box>
                  <Box className="flex-1">
                    <Text size="xSmall" className="text-gray-500">Giới tính</Text>
                    <Text size="small" className="text-gray-900 font-medium">
                      {selectedPet.gender === 'Male' ? 'Đực' : 'Cái'}
                    </Text>
                  </Box>
                </Box>

                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Text className="text-xl">🎨</Text>
                  </Box>
                  <Box className="flex-1">
                    <Text size="xSmall" className="text-gray-500">Màu lông</Text>
                    <Text size="small" className="text-gray-900 font-medium">{selectedPet.color}</Text>
                  </Box>
                </Box>

                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Text className="text-xl">⚖️</Text>
                  </Box>
                  <Box className="flex-1">
                    <Text size="xSmall" className="text-gray-500">Cân nặng</Text>
                    <Text size="small" className="text-gray-900 font-medium">{selectedPet.weight} kg</Text>
                  </Box>
                </Box>

                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Text className="text-xl">🎂</Text>
                  </Box>
                  <Box className="flex-1">
                    <Text size="xSmall" className="text-gray-500">Ngày sinh</Text>
                    <Text size="small" className="text-gray-900 font-medium">
                      {new Date(selectedPet.dateOfBirth).toLocaleDateString('vi-VN')} ({calculateAge(selectedPet.dateOfBirth)})
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Owner Info */}
            <Box className="border-t border-gray-200 pt-4">
              <Text.Title size="small" className="text-gray-900 mb-3">
                Chủ sở hữu
              </Text.Title>
              <Box className="space-y-2">
                <Text size="small" className="text-gray-900">
                  <strong>Tên:</strong> {selectedPet.owner.fullname}
                </Text>
                <Text size="small" className="text-gray-900">
                  <strong>Điện thoại:</strong> {selectedPet.owner.phone}
                </Text>
                <Text size="small" className="text-gray-900">
                  <strong>Email:</strong> {selectedPet.owner.email}
                </Text>
                <Text size="small" className="text-gray-900">
                  <strong>Địa chỉ:</strong> {selectedPet.owner.address.ward}, {selectedPet.owner.address.district}, {selectedPet.owner.address.city}
                </Text>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="highlight"
                fullWidth
                onClick={() => handleEditPet(selectedPet)}
              >
                Chỉnh sửa
              </Button>
              <Button
                type="danger"
                fullWidth
                onClick={() => handleDeletePet(selectedPet)}
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Sheet>
      )}
    </Page>
  );
}

export default PetListPage;

