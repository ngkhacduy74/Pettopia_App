import React, { useState } from 'react';
import { Page, Box, Text, Icon, Button } from 'zmp-ui';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPets, Pet } from '@/data/mockPets';
import petIconHover from '../img/icon/pawprint-gray.png';
import logoCard from '../img/logo-card.png';
import logo from '../img/logo.png';
import catbg from '../img/catbg.jpg';

function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const pet = mockPets.find(p => p.id === id);

  if (!pet) {
    return (
      <Page className="bg-gray-50">
        <Box className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-6xl mb-4">🐾</div>
          <Text.Title className="text-gray-900 mb-2">Không tìm thấy thú cưng</Text.Title>
          <Text className="text-gray-600 mb-6 text-center">Thú cưng này không tồn tại hoặc đã bị xóa</Text>
          <Button onClick={() => navigate('/pets')}>Quay lại danh sách</Button>
        </Box>
      </Page>
    );
  }

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

  const formatDate = (iso?: string) => {
    if (!iso) return 'Chưa rõ';
    try {
      return new Date(iso).toLocaleDateString('vi-VN');
    } catch {
      return iso;
    }
  };

  return (
    <Page className="bg-gray-50 pb-20">
      {/* Header */}
      <Box className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-6 shadow-md">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Box onClick={() => navigate('/pets')} className="cursor-pointer">
              <Icon icon="zi-arrow-left" className="text-white text-xl" />
            </Box>
            <Text.Title size="large" className="text-white font-bold">
              Hồ sơ {pet.name}
            </Text.Title>
          </Box>
        </Box>
      </Box>

      {/* Pet ID Card */}
      <Box className="px-4 py-6">
        <Text.Title size="small" className="text-gray-900 mb-4 text-center" style={{ marginTop: '8px' }}>
          Thẻ căn cước thú cưng
        </Text.Title>
        
        <Box 
          className="relative mx-auto cursor-pointer"
          style={{ width: '100%', maxWidth: '90vw', aspectRatio: '600/380' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Box 
            className="w-full h-full transition-transform duration-600"
            style={{ 
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Front Card */}
            <Box 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <Box className="relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl p-6 h-full border-2 border-gray-400 overflow-hidden">
                <Box className="absolute inset-0 opacity-5">
                  <img src={catbg} alt="Background" className="w-full h-full object-cover" />
                </Box>
                <Box className="relative z-10 h-full flex flex-col">
                  <Box className="flex items-center justify-between mb-4">
                    <Box className="flex items-center">
                      <img src={logoCard} alt="Logo" className="h-6 mr-2" />
                      <Box>
                        <Text className="text-lg font-bold text-gray-900">PETTOPIA</Text>
                        <Text size="xSmall" className="text-gray-700">Pet Identity Card</Text>
                      </Box>
                    </Box>
                    <Box className="bg-white rounded-lg px-2 py-1 border border-gray-400">
                      <Text size="xSmall" className="text-gray-700">
                        ID: {pet.id.slice(0, 8)}
                      </Text>
                    </Box>
                  </Box>

                  <Box className="flex gap-4 mb-3">
                    <Box className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-gray-400 overflow-hidden">
                      <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover" />
                    </Box>
                    <Box className="flex-1">
                      <Text.Title size="large" className="text-gray-900 mb-2" style={{ fontSize: '20px' }}>
                        {pet.name}
                      </Text.Title>
                      <Box className="grid grid-cols-2 gap-2">
                        <Box>
                          <Text size="xSmall" className="text-gray-700">Giống:</Text>
                          <Text size="xSmall" className="font-semibold text-gray-900">{pet.breed}</Text>
                        </Box>
                        <Box>
                          <Text size="xSmall" className="text-gray-700">Màu lông:</Text>
                          <Text size="xSmall" className="font-semibold text-gray-900">{pet.color}</Text>
                        </Box>
                        <Box>
                          <Text size="xSmall" className="text-gray-700">Giới tính:</Text>
                          <Text size="xSmall" className="font-semibold text-gray-900">
                            {pet.gender === 'Male' ? 'Đực' : 'Cái'}
                          </Text>
                        </Box>
                        <Box>
                          <Text size="xSmall" className="text-gray-700">Ngày sinh:</Text>
                          <Text size="xSmall" className="font-semibold text-gray-900">
                            {formatDate(pet.dateOfBirth)}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="mt-auto pt-3 border-t-2 border-gray-400">
                    <Text size="xSmall" className="text-gray-700 text-center">
                      Click để xem mặt sau
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Back Card */}
            <Box 
              className="absolute inset-0 w-full h-full"
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <Box className="relative bg-gradient-to-br from-gray-300 to-gray-200 rounded-2xl shadow-2xl p-6 h-full border-2 border-gray-400 overflow-hidden">
                <Box className="absolute inset-0 opacity-5">
                  <img src={logo} alt="Background" className="w-full h-full object-cover" />
                </Box>
                <Box className="relative z-10 h-full flex flex-col">
                  <Box className="flex items-center mb-4">
                    <img src={logoCard} alt="Logo" className="h-6 mr-2" />
                    <Text.Title size="small" className="text-gray-900" style={{ fontSize: '18px' }}>
                      Thông tin chủ sở hữu
                    </Text.Title>
                  </Box>

                  <Box className="space-y-3">
                    <Box className="flex justify-between border-b-2 border-gray-400 pb-2">
                      <Text size="xSmall" className="text-gray-700">Cân nặng:</Text>
                      <Text size="xSmall" className="font-semibold text-gray-900">{pet.weight} kg</Text>
                    </Box>
                    <Box className="flex justify-between border-b-2 border-gray-400 pb-2">
                      <Text size="xSmall" className="text-gray-700">Màu lông:</Text>
                      <Text size="xSmall" className="font-semibold text-gray-900">{pet.color}</Text>
                    </Box>
                    <Box className="flex justify-between border-b-2 border-gray-400 pb-2">
                      <Text size="xSmall" className="text-gray-700">Chủ sở hữu:</Text>
                      <Text size="xSmall" className="font-semibold text-gray-900">{pet.owner.fullname}</Text>
                    </Box>
                    <Box className="flex justify-between border-b-2 border-gray-400 pb-2">
                      <Text size="xSmall" className="text-gray-700">Số điện thoại:</Text>
                      <Text size="xSmall" className="font-semibold text-gray-900">{pet.owner.phone}</Text>
                    </Box>
                    <Box className="flex justify-between border-b-2 border-gray-400 pb-2">
                      <Text size="xSmall" className="text-gray-700">Email:</Text>
                      <Text size="xSmall" className="font-semibold text-gray-900">{pet.owner.email}</Text>
                    </Box>
                    <Box className="flex justify-between">
                      <Text size="xSmall" className="text-gray-700">Địa chỉ:</Text>
                      <Text size="xSmall" className="font-semibold text-gray-900">
                        {pet.owner.address.ward}, {pet.owner.address.district}
                      </Text>
                    </Box>
                  </Box>

                  <Box className="mt-auto pt-3 border-t-2 border-gray-400">
                    <Text size="xSmall" className="text-gray-700 text-center">
                      Click để xem mặt trước
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Management Features */}
      <Box className="px-4 py-4">
        <Text.Title size="small" className="text-gray-900 mb-4 text-center">
          Tính năng quản lý
        </Text.Title>
        <Box className="space-y-4">
          {/* Pet Diary */}
          <Box className="bg-white rounded-2xl p-4 shadow-md border border-teal-100">
            <Box className="flex items-center mb-4">
              <Box className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mr-3">
                <Icon icon="zi-edit" className="text-teal-600 text-xl" />
              </Box>
              <Text.Title size="small" className="text-gray-900">Nhật ký thú cưng</Text.Title>
            </Box>
            <Text size="small" className="text-gray-600 mb-3">
              Ghi chép những khoảnh khắc đáng nhớ và hoạt động hàng ngày
            </Text>
            <Box className="space-y-2 mb-3">
              <Box className="flex items-center text-sm text-gray-600">
                <Icon icon="zi-check-circle" className="text-teal-600 mr-2" />
                <Text size="xSmall">Theo dõi hoạt động hàng ngày</Text>
              </Box>
              <Box className="flex items-center text-sm text-gray-600">
                <Icon icon="zi-check-circle" className="text-teal-600 mr-2" />
                <Text size="xSmall">Ghi chú thói quen ăn uống</Text>
              </Box>
              <Box className="flex items-center text-sm text-gray-600">
                <Icon icon="zi-check-circle" className="text-teal-600 mr-2" />
                <Text size="xSmall">Lưu trữ kỷ niệm đặc biệt</Text>
              </Box>
            </Box>
            <Button fullWidth size="small" type="highlight">
              Xem nhật ký
            </Button>
          </Box>

          {/* Medical Records */}
          <Box className="bg-white rounded-2xl p-4 shadow-md border border-teal-100">
            <Box className="flex items-center mb-4">
              <Box className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mr-3">
                <Icon icon="zi-heart-solid" className="text-teal-600 text-xl" />
              </Box>
              <Text.Title size="small" className="text-gray-900">Hồ sơ bệnh án</Text.Title>
            </Box>
            <Text size="small" className="text-gray-600 mb-3">
              Theo dõi lịch sử khám bệnh và tình trạng sức khỏe
            </Text>
            {pet.medical_records && pet.medical_records.length > 0 ? (
              <Box className="bg-teal-50 rounded-lg p-3 mb-3">
                <Box className="flex justify-between items-center mb-2">
                  <Text size="xSmall" className="text-gray-600">Khám gần nhất:</Text>
                  <Text size="xSmall" className="font-semibold">
                    {pet.medical_records[0].date ? formatDate(pet.medical_records[0].date) : 'Chưa có'}
                  </Text>
                </Box>
              </Box>
            ) : (
              <Box className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text size="xSmall" className="text-gray-600 text-center">Chưa có hồ sơ bệnh án</Text>
              </Box>
            )}
            <Box className="space-y-2 mb-3">
              <Box className="flex items-center text-sm text-gray-600">
                <Icon icon="zi-check-circle" className="text-teal-600 mr-2" />
                <Text size="xSmall">Hồ sơ bệnh án điện tử</Text>
              </Box>
              <Box className="flex items-center text-sm text-gray-600">
                <Icon icon="zi-check-circle" className="text-teal-600 mr-2" />
                <Text size="xSmall">Lịch sử điều trị</Text>
              </Box>
              <Box className="flex items-center text-sm text-gray-600">
                <Icon icon="zi-check-circle" className="text-teal-600 mr-2" />
                <Text size="xSmall">Theo dõi thuốc men</Text>
              </Box>
            </Box>
            <Button fullWidth size="small" type="highlight">
              Xem hồ sơ
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Upcoming Appointments */}
      <Box className="px-4 py-4">
        <Text.Title size="small" className="text-gray-900 mb-4 text-center">
          Lịch hẹn sắp tới
        </Text.Title>
        <Box className="bg-white rounded-2xl p-4 shadow-md border border-teal-100">
          <Box className="text-center py-8">
            <Text className="text-gray-600">Chưa có lịch hẹn</Text>
          </Box>
        </Box>
      </Box>

      {/* Detailed Information */}
      <Box className="px-4 py-4">
        <Text.Title size="small" className="text-gray-900 mb-4 text-center">
          Thông tin chi tiết
        </Text.Title>
        <Box className="bg-white rounded-2xl p-4 shadow-md border border-teal-100">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-3">
              <Box className="w-16 h-16 rounded-full overflow-hidden">
                <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover" />
              </Box>
              <Box>
                <Text.Title size="small" className="text-gray-900">{pet.name}</Text.Title>
                <Text size="xSmall" className="text-gray-600">
                  {pet.species} • {pet.gender === 'Male' ? 'Đực' : 'Cái'} • {calculateAge(pet.dateOfBirth)}
                </Text>
              </Box>
            </Box>
            <Button 
              size="small" 
              type={showDetails ? "neutral" : "highlight"}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Ẩn' : 'Chi tiết'}
            </Button>
          </Box>

          {showDetails && (
            <Box className="border-t border-gray-200 pt-4 space-y-6">
              {/* Basic Info */}
              <Box>
                <Text.Title size="small" className="text-gray-900 mb-3">Thông tin cơ bản</Text.Title>
                <Box className="space-y-2">
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Loài:</Text>
                    <Text size="small" className="font-medium">{pet.species}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Giống:</Text>
                    <Text size="small" className="font-medium">{pet.breed}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Giới tính:</Text>
                    <Text size="small" className="font-medium">
                      {pet.gender === 'Male' ? 'Đực' : 'Cái'}
                    </Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Ngày sinh:</Text>
                    <Text size="small" className="font-medium">{formatDate(pet.dateOfBirth)}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Cân nặng:</Text>
                    <Text size="small" className="font-medium">{pet.weight} kg</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Màu lông:</Text>
                    <Text size="small" className="font-medium">{pet.color}</Text>
                  </Box>
                </Box>
              </Box>

              {/* Medical Info */}
              <Box className="border-t border-gray-200 pt-4">
                <Text.Title size="small" className="text-gray-900 mb-3">Thông tin y tế</Text.Title>
                <Box className="space-y-2">
                  {pet.medical_records && pet.medical_records.length > 0 ? (
                    <>
                      <Box className="flex justify-between">
                        <Text size="small" className="text-gray-600">Khám gần nhất:</Text>
                        <Text size="small" className="font-medium">
                          {formatDate(pet.medical_records[0].date)}
                        </Text>
                      </Box>
                      <Box>
                        <Text size="small" className="text-gray-600 mb-2">Ghi chú:</Text>
                        <Box className="bg-gray-50 p-3 rounded-lg">
                          <Text size="small">
                            {pet.medical_records[0].description || 'Chưa có ghi chú'}
                          </Text>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Text size="small" className="text-gray-600 text-center py-2">
                      Chưa có thông tin y tế
                    </Text>
                  )}
                </Box>
              </Box>

              {/* Owner Info */}
              <Box className="border-t border-gray-200 pt-4">
                <Text.Title size="small" className="text-gray-900 mb-3">Thông tin chủ sở hữu</Text.Title>
                <Box className="space-y-2">
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Họ tên:</Text>
                    <Text size="small" className="font-medium">{pet.owner.fullname}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">SĐT:</Text>
                    <Text size="small" className="font-medium">{pet.owner.phone}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Email:</Text>
                    <Text size="xSmall" className="font-medium">{pet.owner.email}</Text>
                  </Box>
                  <Box className="flex justify-between">
                    <Text size="small" className="text-gray-600">Địa chỉ:</Text>
                    <Text size="xSmall" className="font-medium">
                      {pet.owner.address.ward}, {pet.owner.address.district}, {pet.owner.address.city}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
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

export default PetDetailPage;