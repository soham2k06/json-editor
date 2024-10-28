"use client";

import JsonDialog from "@/components/json-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import TableEditor from "@/components/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { initialData } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function HomePage() {
  const storedData =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("jsonData") ?? "null");

  const [jsonData, setJsonData] = useState(storedData || initialData);

  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
  }, [jsonData]);

  // Converting object to array if all keys are numeric
  const convertToArray = (data: any) => {
    const allNumeric = Object.keys(data).every((key) => !isNaN(Number(key)));
    if (allNumeric) return Object.values(data);
    return data;
  };

  const exportJSON = () => {
    const convertedData = convertToArray(jsonData);
    const data = JSON.stringify(convertedData, null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";

    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (!content) return;
        const json = JSON.parse(content as string);
        setJsonData(json);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 relative h-screen">
      <div className="flex justify-center items-center gap-4 mb-8">
        <h1 className="text-4xl text-center font-bold">JSON Editor</h1>
        <ModeToggle />
      </div>
      <div className="space-x-2 my-6">
        <JsonDialog json={jsonData} />
        <Button onClick={exportJSON}>Export JSON</Button>
        <label
          htmlFor="import-json"
          className={buttonVariants({ className: "cursor-pointer" })}
        >
          <input
            id="import-json"
            type="file"
            className="sr-only"
            onChange={importJSON}
          />
          Import JSON
        </label>
      </div>

      <TableEditor data={jsonData} onDataChange={setJsonData} />
    </div>
  );
}
