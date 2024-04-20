import type { InjectionKey } from 'vue'
import type { CartProvide } from '@/types/cart.types'
import type { CardProvide } from '@/types/card.types'

export const CartKey: InjectionKey<CartProvide> = Symbol('cart')
export const CardKey: InjectionKey<CardProvide> = Symbol('card')
