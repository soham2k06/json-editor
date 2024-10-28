import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FormEvent, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewData } from "@/lib/types";
import { flattenData, unflattenData } from "@/lib/utils";
import { toast } from "sonner";

interface AddEditDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  dataToEdit?: NewData | null;
  data: unknown[];
  onDataChange: (d: unknown[]) => void;
}

const initialData: NewData = {
  key: "",
  value: "",
};

function AddEditDialog({
  open,
  onOpenChange,
  data,
  onDataChange,
  dataToEdit,
}: AddEditDialogProps) {
  const [formdata, setFormdata] = useState<NewData>(initialData);

  useEffect(() => {
    if (dataToEdit) setFormdata(dataToEdit);
    else setFormdata(initialData);
  }, [dataToEdit]);

  const updateFlattenedData = (
    flattenedData: Record<string, any>,
    oldKey: string,
    newKey: string,
    newValue: string
  ) => {
    if (!flattenedData[oldKey]) return;

    flattenedData[newKey] = newValue;

    // Delete the old key if it's different
    if (oldKey !== newKey) delete flattenedData[oldKey];
  };

  const addNewProperty = (newKey: string, newValue: string) => {
    const flattenedData = flattenData(data);

    const keyExists = Object.keys(flattenedData).some((key) =>
      key.endsWith(`.${newKey}`)
    );

    if (keyExists) {
      return toast.error(
        `Key "${newKey}" already exists. Please choose a different key.`
      );
    }

    flattenedData[newKey] = newValue;

    const updatedData = unflattenData(flattenedData);
    onDataChange(updatedData);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const flattenedData = flattenData(data);

    if (dataToEdit) {
      // If editing existing property
      updateFlattenedData(
        flattenedData,
        dataToEdit.key,
        formdata.key,
        formdata.value
      );

      const updatedData = unflattenData(flattenedData);
      onDataChange(updatedData);

      console.log(flattenedData);
      console.log(unflattenData(flattenedData));
    } else {
      // If adding new property
      addNewProperty(formdata.key, formdata.value);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dataToEdit ? `Edit Key: ${dataToEdit.key}` : "Add New Data"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={formdata.key}
              onChange={(e) =>
                setFormdata({ ...formdata, key: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              value={formdata.value}
              onChange={(e) =>
                setFormdata({ ...formdata, value: e.target.value })
              }
            />
          </div>
          <Button type="submit">Confirm</Button>
          <Button
            className="ml-2"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEditDialog;
