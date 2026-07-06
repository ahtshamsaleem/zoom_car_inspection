"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PHOTO_CATEGORIES } from "@/constants/inspection";
import { PhotoUpload } from "@/components/inspection/photo-upload";
import { useInspectionStore } from "@/stores/inspection-store";

export function PhotosStep() {
  const { photos, addPhoto, removePhoto } = useInspectionStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Vehicle Photos</h2>
        <p className="text-sm text-muted-foreground">
          Upload photos from all required angles and areas
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PHOTO_CATEGORIES.map((cat) => (
          <Card key={cat.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{cat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                value={photos[cat.key] || []}
                onChange={(urls) => {
                  const current = photos[cat.key] || [];
                  current.forEach((u) => {
                    if (!urls.includes(u)) removePhoto(cat.key, u);
                  });
                  urls.forEach((u) => {
                    if (!current.includes(u)) addPhoto(cat.key, u);
                  });
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
