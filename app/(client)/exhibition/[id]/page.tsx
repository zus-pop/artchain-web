'use client'

import CircularGallery from '@/components/CircularGallery'
import { useGetExhibitionById } from '@/apis/exhibition'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const params = useParams()
  const id = params.id as string
  const { data: exhibition } = useGetExhibitionById(id)

  const items = exhibition?.data?.exhibitionPaintings?.filter(painting => painting.imageUrl).map(painting => ({
    image: painting.imageUrl,
    text: painting.title
  })) || []

  console.log('Items passed to CircularGallery:', items)

  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <CircularGallery items={items} bend={1} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
    </div>
  )
}

export default page
