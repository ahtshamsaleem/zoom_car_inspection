"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PhotoUpload } from "@/components/inspection/photo-upload";
import { useTranslation } from "@/hooks/use-translation";

interface CompanySettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  logo_url: string;
  letterhead_header_url: string;
  letterhead_footer_url: string;
  stamp_url: string;
  website: string;
  license_number: string;
  accent_color: string;
  settings?: { reportFooter?: string };
}

const DEFAULT_ACCENT = "#2563eb";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<CompanySettings>({
    name: "",
    phone: "",
    email: "",
    address: "",
    logo_url: "",
    letterhead_header_url: "",
    letterhead_footer_url: "",
    stamp_url: "",
    website: "",
    license_number: "",
    accent_color: DEFAULT_ACCENT,
    settings: { reportFooter: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.name) {
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            logo_url: data.logo_url || "",
            letterhead_header_url: data.letterhead_header_url || "",
            letterhead_footer_url: data.letterhead_footer_url || "",
            stamp_url: data.stamp_url || "",
            website: data.website || "",
            license_number: data.license_number || "",
            accent_color: data.accent_color || DEFAULT_ACCENT,
            settings: { reportFooter: data.settings?.reportFooter || "" },
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        logo_url: form.logo_url,
        letterhead_header_url: form.letterhead_header_url,
        letterhead_footer_url: form.letterhead_footer_url,
        stamp_url: form.stamp_url,
        website: form.website,
        license_number: form.license_number,
        accent_color: form.accent_color,
        settings: form.settings,
      }),
    });

    if (res.ok) {
      toast.success(t("settings.toast.success"));
    } else {
      const data = await res.json();
      toast.error(data.error || t("settings.toast.error"));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.branding.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("settings.branding.logo.label")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("settings.branding.logo.hint")}
            </p>
            <PhotoUpload
              value={form.logo_url ? [form.logo_url] : []}
              onChange={(urls) =>
                setForm({ ...form, logo_url: urls[0] || "" })
              }
              multiple={false}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.branding.letterheadHeader.label")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("settings.branding.letterheadHeader.hint")}
            </p>
            <PhotoUpload
              value={form.letterhead_header_url ? [form.letterhead_header_url] : []}
              onChange={(urls) =>
                setForm({ ...form, letterhead_header_url: urls[0] || "" })
              }
              multiple={false}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.branding.letterheadFooter.label")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("settings.branding.letterheadFooter.hint")}
            </p>
            <PhotoUpload
              value={form.letterhead_footer_url ? [form.letterhead_footer_url] : []}
              onChange={(urls) =>
                setForm({ ...form, letterhead_footer_url: urls[0] || "" })
              }
              multiple={false}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.branding.stamp.label")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("settings.branding.stamp.hint")}
            </p>
            <PhotoUpload
              value={form.stamp_url ? [form.stamp_url] : []}
              onChange={(urls) =>
                setForm({ ...form, stamp_url: urls[0] || "" })
              }
              multiple={false}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.branding.accentColor.label")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("settings.branding.accentColor.hint")}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) =>
                  setForm({ ...form, accent_color: e.target.value })
                }
                className="h-10 w-14 cursor-pointer rounded border"
              />
              <Input
                value={form.accent_color}
                onChange={(e) =>
                  setForm({ ...form, accent_color: e.target.value })
                }
                placeholder={DEFAULT_ACCENT}
                className="max-w-[140px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.info.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("settings.info.name")}</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.info.phone")}</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t("settings.info.phonePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.info.email")}</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.info.website")}</Label>
            <Input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder={t("settings.info.websitePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.info.address")}</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.info.licenseNumber")}</Label>
            <Input
              value={form.license_number}
              onChange={(e) =>
                setForm({ ...form, license_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("settings.info.footerNotes")}</Label>
            <Textarea
              value={form.settings?.reportFooter || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: { ...form.settings, reportFooter: e.target.value },
                })
              }
              placeholder={t("settings.info.footerNotesPlaceholder")}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("settings.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}