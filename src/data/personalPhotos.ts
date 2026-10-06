// Add personal photo URLs here; these slots are independent of the Journey collection.
export const personalPhotos: { id: string; src: string; alt: string }[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `personal-${String(index + 1).padStart(2, '0')}`,
    src: '',
    alt: `个人剪影 ${String(index + 1).padStart(2, '0')}`,
  }),
)
