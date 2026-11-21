export type Equipment = {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  quantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: "pending" | "approved" | "rejected";
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
};

export type Review = {
  _id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
};