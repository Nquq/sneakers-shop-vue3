import type { Ref } from 'vue'

export interface CardProps {
  imageUrl: string
  title: string
  price: number
  isFavorite: boolean
  isAdded: boolean
}

export type Card = CardProps & { favoriteId: number | null; id: number }

export interface CardsListProps {
  items: Card[]
}

export interface CardListFunctions {
  (event: 'addToFavorite', item: Card): void
  (event: 'addToCart', item: Card): void
}

export interface CardFunctions {
  (event: 'onClickFavorite'): void
  (event: 'onClickAddButton'): void
}

export interface CardProvide {
  items: Ref<Card[]>
  addToFavorite: (item: Card) => Promise<void>
}
