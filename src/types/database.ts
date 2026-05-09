export type GuideType = 'licensed' | 'travel_buddy'
export type ServiceType = 'guide' | 'airport_pickup' | 'landmark'

export interface HeroImage {
  id: string
  image_url: string
  alt_text_ja: string
  alt_text_en: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Guide {
  id: string
  name: string
  type: GuideType
  bio_ja: string
  bio_en: string
  photo_url: string | null
  languages: string[]
  experience_years: number
  license_number: string | null
  specialties: string[]
  age: number | null
  has_license: boolean
  service_areas: string[]
  is_active: boolean
  created_at: string
}

export interface Package {
  id: string
  guide_id: string
  title_ja: string
  title_en: string
  description_ja: string
  description_en: string
  duration: string
  price_usd: number
  included_items: string[]
  photo_url: string | null
  is_active: boolean
  created_at: string
  guide?: Guide
}

export interface AirportPickupService {
  id: string
  company_name: string
  vehicle_type: string
  capacity: number
  price_usd: number
  description_ja: string
  description_en: string
  photo_url: string | null
  is_active: boolean
}

export interface Landmark {
  id: string
  name_ja: string
  name_en: string
  slug: string
  description_ja: string
  description_en: string
  location: string
  tips_ja: string
  tips_en: string
  photos: string[]
  is_featured: boolean
}

export interface Review {
  id: string
  client_name: string
  review_ja: string
  review_en: string
  rating: number
  photo_url: string | null
  service_type: ServiceType
  created_at: string
}

export interface AboutContent {
  id: string
  title_ja: string
  title_en: string
  content_ja: string
  content_en: string
  photo_url: string | null
}

export interface ContactInfo {
  id: string
  email: string
  whatsapp: string
  line_id: string
  instagram: string
  facebook: string
  address: string
}
