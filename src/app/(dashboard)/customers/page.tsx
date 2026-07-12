"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import type { Customer } from "@/types";

export default function CustomersPage() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = search ? `?search=${search}` : "";
    fetch(`/api/customers${params}`)
      .then((r) => r.json())
      .then(setCustomers)
      .catch(() => setCustomers([]));
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("customers.title")}</h1>
        <p className="text-muted-foreground">{t("customers.subtitle")}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("customers.searchPlaceholder")}
          className="ps-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("customers.table.name")}</TableHead>
              <TableHead>{t("customers.table.mobile")}</TableHead>
              <TableHead>{t("customers.table.email")}</TableHead>
              <TableHead>{t("customers.table.emiratesId")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {t("customers.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell>{c.email || "—"}</TableCell>
                  <TableCell>{c.emirates_id || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}