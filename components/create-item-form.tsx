"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SAUDI_CITIES } from "@/lib/types"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { storage } from "@/lib/storage"
import { createThumbnail } from "@/lib/image-utils"
import type { Item } from "@/lib/types"

export function CreateItemForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    starting_price: "",
    duration: "24",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Limit to 10 images
      const newFiles = [...imageFiles, ...files].slice(0, 10)
      setImageFiles(newFiles)
      
      // Generate previews
      const newPreviews: string[] = []
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === newFiles.length) {
            setImagePreviews(newPreviews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload all images and create thumbnails
      const imageUrls: string[] = []
      const thumbnailUrls: string[] = []
      
      if (imageFiles.length > 0) {
        // Create thumbnails for all images
        const thumbnailFiles = await Promise.all(
          imageFiles.map(file => createThumbnail(file))
        )
        
        // Upload original images
        const imageUploadResults = await Promise.all(
          imageFiles.map(file => storage.uploadImage(file))
        )
        imageUrls.push(...imageUploadResults.filter((url): url is string => url !== null))
        
        // Upload thumbnails
        const thumbnailUploadResults = await Promise.all(
          thumbnailFiles.map(file => storage.uploadImage(file))
        )
        thumbnailUrls.push(...thumbnailUploadResults.filter((url): url is string => url !== null))
      }

      // Send data with all images and thumbnails
      const newItem = {
        title: formData.title,
        description: formData.description || null,
        imageUrl: imageUrls[0] || null,
        images: imageUrls,
        thumbnails: thumbnailUrls,
        city: formData.city,
        startingPrice: formData.starting_price,
        duration: formData.duration,
      }

      const createdItem = await storage.saveItem(newItem)
      if (createdItem) {
        router.push(`/${createdItem.id}`)
      }
    } catch (error) {
      console.error("[v0] Submit error:", error)
      alert(`Failed to create listing: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Images (up to 10)</Label>
        <div className="flex flex-col gap-4">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                  <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {imageFiles.length < 10 && (
            <label
              htmlFor="image"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-8 transition-colors hover:bg-muted"
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                {imagePreviews.length > 0 ? `Add more images (${imageFiles.length}/10)` : "Upload images"}
              </span>
              <input id="image" type="file" accept="image/*" multiple onChange={handleImageChange} className="sr-only" />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., iPhone 15 Pro Max"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your item..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Select required value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="starting_price">Starting Price (SAR) *</Label>
          <Input
            id="starting_price"
            type="number"
            required
            min="1"
            step="0.01"
            value={formData.starting_price}
            onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
            placeholder="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration *</Label>
        <Select
          required
          value={formData.duration}
          onValueChange={(value) => setFormData({ ...formData, duration: value })}
        >
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 hour</SelectItem>
            <SelectItem value="6">6 hours</SelectItem>
            <SelectItem value="12">12 hours</SelectItem>
            <SelectItem value="24">24 hours</SelectItem>
            <SelectItem value="48">48 hours</SelectItem>
            <SelectItem value="72">3 days</SelectItem>
            <SelectItem value="168">7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Listing"
        )}
      </Button>
    </form>
  )
}
