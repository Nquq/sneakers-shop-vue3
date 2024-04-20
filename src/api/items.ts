import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { Card } from '@/types/card.types'
import type { FavoriteResponse } from '@/types/favorites.types'

const url = 'https://676e203f06f3a27b.mokky.dev'

export const getItemsWithFilters = async (config: AxiosRequestConfig) => {
  const { data }: AxiosResponse<Card[]> = await axios.get(`${url}/items`, config)

  return data
}

export const getItems = async () => {
  const { data }: AxiosResponse<Card[]> = await axios.get(`${url}/items`)

  return data
}

export const getFavorite = async () => {
  const { data }: AxiosResponse<FavoriteResponse[]> = await axios.get(`${url}/favorites`)

  return data
}
