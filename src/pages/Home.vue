<script setup lang="ts">
import CardList from '@/components/CardList.vue'
import { type AxiosRequestConfig } from 'axios'
import { onMounted, reactive, ref, watch } from 'vue'
import Title from '@/components/Title.vue'
import debounce from 'lodash.debounce'
import { injectStrict } from '@/utils/injectStrict'
import { CardKey, CartKey } from '@/types/symbols'
import { getFavorite, getItemsWithFilters } from '@/api/items'
import Loader from '@/components/Loader.vue'

const { cart, onClickAddToCartButton } = injectStrict(CartKey)
const { items, addToFavorite } = injectStrict(CardKey)
const isLoading = ref(true)
const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onChangeSelect = ({ target }: Event) => {
  filters.sortBy = (target as HTMLSelectElement).value
}

const onChangeSearchInput = debounce(({ target }: Event) => {
  filters.searchQuery = (target as HTMLInputElement).value
}, 400)

const fetchFavorites = async () => {
  try {
    const favorites = await getFavorite()
    items.value = items.value.map((item) => {
      const favorite = favorites.find((fav) => fav.item_id === item.id)

      if (!favorite) return item
      return { ...item, isFavorite: true, favoriteId: favorite.id }
    })
  } catch (err) {
    console.error(err)
  }
}

const fetchItemsWithFilters = async () => {
  try {
    const config: AxiosRequestConfig = {
      params: {
        sortBy: filters.sortBy
      }
    }

    if (filters.searchQuery) {
      config.params.title = `*${filters.searchQuery}*`
    }

    const data = await getItemsWithFilters(config)

    items.value = data.map((item) => ({
      ...item,
      isFavorite: false,
      isAdded: false,
      favoriteId: null
    }))
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  isLoading.value = true

  await fetchItemsWithFilters()
  await fetchFavorites()

  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
  isLoading.value = false
})

watch(filters, fetchItemsWithFilters)
watch(cart, () => {
  if (cart.value.length === 0) {
    items.value = items.value.map((item) => ({ ...item, isAdded: false }))
  }
})
</script>

<template>
  <div class="flex items-center justify-between">
    <Title title="Все кроссовки" />

    <div class="flex items-center gap-5">
      <select
        @change="onChangeSelect"
        class="py-2 px-3 border rounded-md outline-none"
        name="filter"
        id="filter"
      >
        <option value="title">По названию</option>
        <option value="price">По возрастанию цены</option>
        <option value="-price">По убыванию цены</option>
      </select>

      <div class="relative">
        <img class="absolute left-3 top-3" src="/search.svg" alt="Search" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-10 pr-4 outline-none focus:border-gray-400"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <Loader v-if="isLoading" />
    <CardList
      v-else
      :items="items"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddToCartButton"
    />
  </div>
</template>
