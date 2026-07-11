"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function PhotoUpload({
  value = [],
  onChange,
  multiple = true,
  className,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setUploading(true);

      const newUrls: string[] = [];
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("image", file);

          const { data } = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (data.url) {
            newUrls.push(data.url);
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        }

        if (newUrls.length) {
          onChange(multiple ? [...value, ...newUrls] : newUrls);
        }
      } catch (error) {
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Something went wrong while uploading. Please try again.";
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, multiple]
  );

  const removePhoto = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Uploaded"
              className="h-24 w-24 rounded-lg object-cover border"
            />
            <button
              type="button"
              onClick={() => removePhoto(url)}
              className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 hover:bg-muted/50 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading}
        />
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="text-sm text-muted-foreground">
          {uploading ? "Uploading..." : "Click to upload photos"}
        </span>
      </label>
    </div>
  );
}