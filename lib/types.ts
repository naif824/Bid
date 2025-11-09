export interface Item {
  id: string
  title: string
  description?: string
  imageUrl?: string
  images?: string[]
  thumbnails?: string[]
  city: string
  startingPrice: number
  currentPrice: number
  sellerName: string
  sellerPhone: string
  createdAt: string
  endsAt: string
  userId: string
  hidden?: boolean
  bids?: Bid[]
  _count?: {
    bids: number
  }
}

export interface Bid {
  id: string
  itemId: string
  bidderName: string
  amount: number
  createdAt: string
  userId: string
}

export const SAUDI_CITIES = [
  "Riyadh",
  "Jeddah",
  "Mecca",
  "Medina",
  "Dammam",
  "Khobar",
  "Dhahran",
  "Taif",
  "Buraidah",
  "Tabuk",
  "Khamis Mushait",
  "Hail",
  "Najran",
  "Abha",
  "Yanbu",
  "Al Kharj",
  "Jubail",
  "Al Qatif",
]
