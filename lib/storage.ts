import type { Item, Bid } from "./types"

// API-based storage (replaces localStorage)
export const storage = {
  // Items
  async getItems(): Promise<Item[]> {
    try {
      const res = await fetch("/api/items", { cache: "no-store" })
      if (!res.ok) return []
      return await res.json()
    } catch (error) {
      console.error("Error fetching items:", error)
      return []
    }
  },

  async getItem(id: string): Promise<Item | null> {
    try {
      const res = await fetch(`/api/items/${id}`, { cache: "no-store" })
      if (!res.ok) return null
      return await res.json()
    } catch (error) {
      console.error("Error fetching item:", error)
      return null
    }
  },

  async saveItem(item: any): Promise<Item | null> {
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create item")
      }
      return await res.json()
    } catch (error) {
      console.error("Error saving item:", error)
      throw error
    }
  },

  // Bids
  async getBids(itemId: string): Promise<Bid[]> {
    try {
      const res = await fetch(`/api/items/${itemId}/bids`, { cache: "no-store" })
      if (!res.ok) return []
      return await res.json()
    } catch (error) {
      console.error("Error fetching bids:", error)
      return []
    }
  },

  async saveBid(bid: Omit<Bid, "id" | "createdAt">): Promise<Bid | null> {
    try {
      const res = await fetch(`/api/items/${bid.itemId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bid)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to place bid")
      }
      return await res.json()
    } catch (error) {
      console.error("Error saving bid:", error)
      throw error
    }
  },

  // Image upload
  async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to upload image")
      }
      
      const data = await res.json()
      return data.imageUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }
}
