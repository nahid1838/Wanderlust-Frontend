export type IDestination = {
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
