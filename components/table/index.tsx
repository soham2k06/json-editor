"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { flattenData, flattenKeys, unflattenData } from "@/lib/utils";
import { NewData } from "@/lib/types";
import AddEditDialog from "./add-edit-dialog";
import { toast } from "sonner";

interface TableEditorProps {
  data: any[];
  onDataChange: (data: any[]) => void;
}

export default function TableEditor({ data, onDataChange }: TableEditorProps) {
  const headers = flattenKeys(data);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<NewData | null>(null);

  const deleteColumn = (keyToDelete: string) => {
    const flattenedData = flattenData(data);

    if (!(keyToDelete in flattenedData))
      return toast.error(`Key "${keyToDelete}" does not exist.`);

    delete flattenedData[keyToDelete];

    const newData = unflattenData(flattenedData);

    onDataChange(newData);
  };

  const handleEdit = (header: string) => {
    setDataToEdit({
      key: header,
      value: flattenData(data)[header],
    });
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Table className="mb-12">
        <TableHeader className="bg-[#e9950c]">
          <TableRow>
            <TableHead className="text-[#fbf7f0]">Key</TableHead>
            <TableHead className="text-[#fbf7f0]">Value</TableHead>
            <TableHead className="w-32"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.sort().map((header) => (
            <TableRow key={header}>
              <TableHead className="text-foreground font-medium text-base border italic">
                {header}
              </TableHead>
              <TableCell className="text-[#00a67d] font-semibold text-base border">
                {flattenData(data)[header]}
              </TableCell>
              <TableCell className="flex gap-3 justify-center border">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleEdit(header)}
                >
                  <Edit2 className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteColumn(header)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="sticky bottom-2 max-w-sm mx-auto">
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-full">
          <Plus className="size-4 mr-2" />
          Add data
        </Button>
      </div>

      <AddEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        dataToEdit={dataToEdit}
        data={data}
        onDataChange={onDataChange}
      />

      <AddEditDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        data={data}
        onDataChange={onDataChange}
      />
    </>
  );
}
