"use client"

import { ScrollStrip } from "@/registry/new-york/ui/scroll-strip"

const IMAGES = [
  "photo-1506905925346-21bda4d32df4", // mountain ridge
  "photo-1441974231531-c6227db76b6e", // forest road
  "photo-1470071459604-3b5ec3a7fe05", // foggy hills
  "photo-1433086966358-54859d0ed716", // waterfall
  "photo-1501785888041-af3ef285b470", // lake & peaks
  "photo-1472214103451-9374bd1c798e", // golden field
  "photo-1465146344425-f00d5f5c8f07", // flowers
  "photo-1447752875215-b2761acb3c5d", // forest light
  "photo-1469474968028-56623f02e42e", // valley sunburst
].map(
  (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&h=720&q=80`,
)

export function ScrollStripDemo() {
  // You own each frame's content — it fills the expanded box and shows
  // through the sliver clip while collapsed.
  const frames = IMAGES.map((src, i) => (
    <img
      key={i}
      src={src}
      alt={`Frame ${i + 1} of ${IMAGES.length}`}
      draggable={false}
      className="pointer-events-none h-full w-full object-cover"
    />
  ))

  return (
    <ScrollStrip
      items={frames}
      frameWidth={48}
      frameHeight={192}
      expandedWidth={256}
      expandedHeight={360}
      gap={12}
      frameRadius={10}
      frameClassName="bg-muted grayscale transition-[filter] duration-300 hover:grayscale-0 data-[active=true]:grayscale-0"
    />
  )
}
