"use client";

import React, { useEffect, useState } from "react";
import JsonView from "./json-view";
import { Button, buttonVariants } from "./ui/button";

export type JsonEditorProps = {
  data: Record<string, any>;
};

function JsonEditor(props: JsonEditorProps) {
  const storedData =
    typeof window !== "undefined" ? localStorage.getItem("jsonData") : null;

  const [editObject, setEditObject] = useState<any>(storedData || props.data);

  useEffect(() => {
    if (storedData) setEditObject(JSON.parse(storedData));
  }, []);

  useEffect(() => {
    localStorage.setItem("jsonData", JSON.stringify(editObject));
  }, [editObject]);

  // Converting object to array if all keys are numeric
  const convertToArray = (data: any) => {
    const allNumeric = Object.keys(data).every((key) => !isNaN(Number(key)));
    if (allNumeric) return Object.values(data);
    return data;
  };

  const exportJSON = () => {
    const convertedData = convertToArray(editObject);
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
        try {
          const json = JSON.parse(content as string);
          setEditObject(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div className="space-x-2 my-6">
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
      <div className="leading-none text-xs">
        <JsonView
          {...{
            editObject,
            setEditObject,
          }}
        />
      </div>
    </>
  );
}

export default JsonEditor;
