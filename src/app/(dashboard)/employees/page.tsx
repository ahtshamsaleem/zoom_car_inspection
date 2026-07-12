"use client";

import { useEffect, useState } from "react";
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
import type { Profile } from "@/types";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Profile[]>([]);

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

  // in openEdit
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
      toast.success("Employee deleted");
      setDeleteOpen(false);
      setDeletingEmployee(null);
      loadEmployees();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to delete employee");
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
      toast.success("Employee added");
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
      toast.error(data.error || "Failed to add employee");
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
      toast.success("Employee updated");
      setEditOpen(false);
      loadEmployees();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to update employee");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">
            Manage inspectors and managers
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger  >
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="text"
                  placeholder="Leave blank to auto-generate"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm({ ...form, role: v as "manager" | "inspector" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspector">Inspector</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No employees yet
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.full_name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.is_active ? "default" : "secondary"}>
                      {emp.is_active ? "Active" : "Inactive"}
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
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
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
                  <SelectItem value="inspector">Inspector</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive employees cannot log in
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
                {editForm.isActive ? "Active" : "Inactive"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>New Password (optional)</Label>
              <Input
                type="text"
                placeholder="Leave blank to keep current password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>



      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Employee</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete{" "}
        <span className="font-medium text-foreground">
          {deletingEmployee?.full_name}
        </span>
        {" "}and remove their access. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


    </div>
  );
}
