import { createSlice } from '@reduxjs/toolkit'
import { loadList } from './storage.js'
import { addToast } from './uiSlice.js'

const initialState = {
  ids: loadList('wishlist')
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id)
      } else {
        state.ids.push(id)
      }
    },
    clearWishlist(state) {
      state.ids = []
    }
  }
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions

// Toggle a product and show the same toast everywhere (card, quick view, page).
export const toggleWishlistItem = (id) => (dispatch, getState) => {
  const wasWished = getState().wishlist.ids.includes(id)
  dispatch(toggleWishlist(id))
  dispatch(
    addToast(
      wasWished ? 'Removed from wishlist' : 'Added to wishlist',
      wasWished ? 'info' : 'success'
    )
  )
}

export default wishlistSlice.reducer

export const selectWishlistIds = (state) => state.wishlist.ids
export const selectWishlistCount = (state) => state.wishlist.ids.length
