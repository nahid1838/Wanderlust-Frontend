export interface IDestination {
  _id: string
  destinationName: string
  country: string
  category: string
  price: number
  duration: string
  departureDate: string
  imageUrl: string
  description: string
  /** Optional — the current API doesn't send these; UI uses design fallbacks. */
  rating?: number
  reviews?: number
  highlights?: string[]
}

export interface IBooking  {
  _id: string
  userName: string
  userEmail: string
  userImage?: string
  destinationName: string
  country: string
  category?: string
  price: number | string
  duration: string
  departureDate: string
  imageUrl: string
  description: string
  bookingDate: string
}

export interface IFeaturedDestination {
  _id: string
  destinationName: string
  country: string
  category: string
  price: number
  duration: string
  departureDate: string
  imageUrl: string
  description: string
  /** Optional — the current API doesn't send this; UI uses the design fallback. */
  rating?: number
}


