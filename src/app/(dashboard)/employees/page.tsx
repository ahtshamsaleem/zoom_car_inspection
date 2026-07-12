"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import type { Profile, UserRole } from "@/types";

export default function EmployeesPage() {
  const { t, locale } = useTranslation();
  const [employees, setEmployees] = useState<Profile[]>([]);

  // Translated per-locale, recomputed only when locale changes
  const ROLE_OPTIONS: Record<UserRole, string> = useMemo(
    () => ({
      inspector: t("employees.roles.inspector"),
      manager: t("employees.roles.manager"),
    }),
    [locale]
  );

  // Create dialog state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "inspector" as "manager" | "inspector",
    password: "",
  });

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    role: "inspector" as "manager" | "inspector",
    password: "",
    isActive: true,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Profile | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const openEdit = (emp: Profile) => {
    setEditingId(emp.id);
    setEditForm({
      fullName: emp.full_name || "",
      phone: emp.phone || "",
      role: emp.role as "manager" | "inspector",
      password: "",
      isActive: emp.is_active,
    });
    setEditOpen(true);
  };

  const openDelete = (emp: Profile) => {
    setDeletingEmployee(emp);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingEmployee) return;

    setIsDeleting(true);
    const res = await fetch(`/api/employees/${deletingEmployee.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (res.ok) {
      toast.success(t("employees.toasts.deleted"));
      setDeleteOpen(false);
      setDeletingEmployee(null);
      loadEmployees();
    } else {
      const data = await res.json();
      toast.error(data.error || t("employees.toasts.deleteFailed"));
    }
  };

  const loadEmployees = () => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then(setEmployees)
      .catch(() => setEmployees([]));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success(t("employees.toasts.added"));
      setOpen(false);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        role: "inspector",
        password: "",
      });
      loadEmployees();
    } else {
      const data = await res.json();
      toast.error(data.error || t("employees.toasts.addFailed"));
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const payload: Record<string, unknown> = {
      fullName: editForm.fullName,
      phone: editForm.phone,
      role: editForm.role,
      isActive: editForm.isActive,
    };
    if (editForm.password.trim()) {
      payload.password = editForm.password.trim();
    }

    const res = await fetch(`/api/employees/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(t("employees.toasts.updated"));
      setEditOpen(false);
      loadEmployees();
    } else {
      const data = await res.json();
      toast.error(data.error || t("employees.toasts.updateFailed"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("employees.title")}</h1>
          <p className="text-muted-foreground">{t("employees.subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 me-1" />
              {t("employees.addEmployee")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("employees.dialogs.addTitle")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("employees.form.fullName")}</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("employees.form.email")}</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("employees.form.phone")}</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("employees.form.password")}</Label>
                <Input
                  type="text"
                  placeholder={t("employees.form.passwordPlaceholderCreate")}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("employees.form.role")}</Label>
                <Select
                  items={ROLE_OPTIONS}
                  value={form.role}
                  onValueChange={(v) =>
                    setForm({ ...form, role: v as "manager" | "inspector" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspector">
                      {ROLE_OPTIONS.inspector}
                    </SelectItem>
                    <SelectItem value="manager">
                      {ROLE_OPTIONS.manager}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">
                {t("employees.dialogs.createButton")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("employees.table.name")}</TableHead>
              <TableHead>{t("employees.table.email")}</TableHead>
              <TableHead>{t("employees.table.phone")}</TableHead>
              <TableHead>{t("employees.table.role")}</TableHead>
              <TableHead>{t("employees.table.status")}</TableHead>
              <TableHead className="w-[80px]">{t("employees.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t("employees.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.full_name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ROLE_OPTIONS[emp.role as UserRole]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.is_active ? "default" : "secondary"}>
                      {emp.is_active
                        ? t("employees.status.active")
                        : t("employees.status.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(emp)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDelete(emp)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("employees.dialogs.editTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("employees.form.fullName")}</Label>
              <Input
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("employees.form.phone")}</Label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("employees.form.role")}</Label>
              <Select
                items={ROLE_OPTIONS}
                value={editForm.role}
                onValueChange={(v) =>
                  setEditForm({
                    ...editForm,
                    role: v as "manager" | "inspector",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspector">
                    {ROLE_OPTIONS.inspector}
                  </SelectItem>
                  <SelectItem value="manager">
                    {ROLE_OPTIONS.manager}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>{t("employees.form.active")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("employees.form.activeHint")}
                </p>
              </div>
              <Button
                type="button"
                variant={editForm.isActive ? "default" : "secondary"}
                size="sm"
                onClick={() =>
                  setEditForm({ ...editForm, isActive: !editForm.isActive })
                }
              >
                {editForm.isActive
                  ? t("employees.status.active")
                  : t("employees.status.inactive")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>{t("employees.form.newPassword")}</Label>
              <Input
                type="text"
                placeholder={t("employees.form.passwordPlaceholderEdit")}
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">
              {t("employees.dialogs.saveButton")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("employees.dialogs.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("employees.dialogs.deleteDescriptionPrefix")}{" "}
              <span className="font-medium text-foreground">
                {deletingEmployee?.full_name}
              </span>{" "}
              {t("employees.dialogs.deleteDescriptionSuffix")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? t("employees.dialogs.deleting") : t("employees.dialogs.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}