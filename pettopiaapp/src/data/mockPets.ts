// Mock data for pets
export interface PetOwner {
  user_id: string;
  fullname: string;
  phone: string;
  email: string;
  address: {
    city: string;
    district: string;
    ward: string;
  };
}

export interface MedicalRecord {
  id: string;
  date: string;
  description: string;
  doctor: string;
}

export interface Pet {
  _id: string;
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  color: string;
  weight: number;
  dateOfBirth: string;
  owner: PetOwner;
  avatar_url: string;
  medical_records: MedicalRecord[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const mockPets: Pet[] = [
  {
    "_id": "6901dbc46f6f3722cc7d7478",
    "id": "19522b8e-a13e-476e-a708-c776dc59f397",
    "name": "Milo",
    "species": "Dog",
    "breed": "Golden Retriever",
    "gender": "Male",
    "color": "Golden Brown",
    "weight": 12.5,
    "dateOfBirth": "2023-05-15T00:00:00.000Z",
    "owner": {
      "user_id": "265b7f9b-a78e-4adf-b251-ff158f15141d",
      "fullname": "Nguyễn VIệt Đức",
      "phone": "0975489030",
      "email": "nvd3002@gmail.com",
      "address": {
        "city": "Hanoi",
        "district": "Hà đông",
        "ward": "Mộ lao"
      }
    },
    "avatar_url": "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg",
    "medical_records": [],
    "createdAt": "2025-10-29T09:17:56.674Z",
    "updatedAt": "2025-10-29T09:17:56.674Z",
    "__v": 0
  },
  {
    "_id": "6901dbc46f6f3722cc7d7479",
    "id": "19522b8e-a13e-476e-a708-c776dc59f398",
    "name": "Luna",
    "species": "Cat",
    "breed": "British Shorthair",
    "gender": "Female",
    "color": "Gray",
    "weight": 4.2,
    "dateOfBirth": "2022-08-20T00:00:00.000Z",
    "owner": {
      "user_id": "265b7f9b-a78e-4adf-b251-ff158f15141d",
      "fullname": "Nguyễn VIệt Đức",
      "phone": "0975489030",
      "email": "nvd3002@gmail.com",
      "address": {
        "city": "Hanoi",
        "district": "Hà đông",
        "ward": "Mộ lao"
      }
    },
    "avatar_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
    "medical_records": [],
    "createdAt": "2025-10-29T09:17:56.674Z",
    "updatedAt": "2025-10-29T09:17:56.674Z",
    "__v": 0
  },
  {
    "_id": "6901dbc46f6f3722cc7d7480",
    "id": "19522b8e-a13e-476e-a708-c776dc59f399",
    "name": "Buddy",
    "species": "Dog",
    "breed": "Labrador",
    "gender": "Male",
    "color": "Yellow",
    "weight": 15.8,
    "dateOfBirth": "2023-03-10T00:00:00.000Z",
    "owner": {
      "user_id": "265b7f9b-a78e-4adf-b251-ff158f15141d",
      "fullname": "Nguyễn VIệt Đức",
      "phone": "0975489030",
      "email": "nvd3002@gmail.com",
      "address": {
        "city": "Hanoi",
        "district": "Hà đông",
        "ward": "Mộ lao"
      }
    },
    "avatar_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    "medical_records": [],
    "createdAt": "2025-10-29T09:17:56.674Z",
    "updatedAt": "2025-10-29T09:17:56.674Z",
    "__v": 0
  }
];

