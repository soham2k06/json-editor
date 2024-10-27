import React, { useState } from "react";
import {
  getKeyList,
  getQuoteAddress,
  getTypeString,
  isObject,
} from "@/lib/utils";
import { DataType, typeMap } from "@/lib/constants";
import { ConfigContext } from "@/contexts/config-context";

import AddItem from "./add-item";
import ArrayView from "./array-view";
import ToolsView from "./tools-view";
import CollapsePart from "./collapse";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type JsonViewProps = {
  setEditObject: any;
  editObject: Record<string, any>;
};

function JsonView(props: JsonViewProps) {
  const { editObject, setEditObject } = props;
  const [allowMap, setAllowMap] = useState<Record<string, boolean>>({});

  // Usefull to convert array to object
  const syncData = (data: Record<string, any>) => setEditObject({ ...data });

  const onClickDelete = (key: string, sourceData: any) => {
    if (Array.isArray(sourceData)) {
      sourceData.splice(+key, 1);
    } else {
      Reflect.deleteProperty(sourceData, key);
    }
    syncData(editObject);
  };

  const onChangeType = (type: DataType, uniqueKey: string) => {
    const newEditObject = getQuoteAddress(
      typeMap[type],
      getKeyList(uniqueKey),
      editObject
    );

    syncData(newEditObject);
  };

  const onChangeKey = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentKey: string,
    uniqueKey: string,
    source: Record<string, any>
  ) => {
    const newValue: Record<string, any> = {};
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (key === currentKey) {
          newValue[event.target.value] = source[key];
        } else {
          newValue[key] = source[key];
        }
      }
    }

    const indexKeys = getKeyList(uniqueKey);
    const ROOT_LEVEL = 1;
    if (indexKeys.length === ROOT_LEVEL) {
      syncData(newValue);
    } else {
      // remove last key equals set parent value
      indexKeys.pop();
      const newTotalData = getQuoteAddress(newValue, indexKeys, editObject);
      syncData(newTotalData);
    }
  };

  const onChangeValue = (
    value: any,
    key: string,
    source: Record<string, any>
  ) => {
    source[key] = value;
    syncData(editObject);
  };

  const getValue = (
    fieldValue: any,
    fieldKey: string,
    sourceData: any,
    deepLevel: number,
    parentUniqueKey: string,
    fullKeyNotation: string
  ) => {
    const thatType = getTypeString(fieldValue);

    switch (thatType) {
      case DataType.ARRAY:
        return (
          <ArrayView
            fieldValue={fieldValue}
            fieldKey={fieldKey}
            sourceData={sourceData}
            deepLevel={deepLevel}
            parentUniqueKey={parentUniqueKey}
            getValue={getValue}
            fullKeyNotation={fullKeyNotation} // pass it down
          />
        );
      case DataType.OBJECT:
        return renderJsonConfig(
          fieldValue,
          deepLevel + 1,
          parentUniqueKey,
          fullKeyNotation
        );
      case DataType.STRING:
        return (
          <Input
            value={fieldValue}
            placeholder="value"
            onChange={(e) =>
              onChangeValue(e.target.value, fieldKey, sourceData)
            }
            className="max-w-xs"
          />
        );
      case DataType.NUMBER:
        return (
          <Input
            type="number"
            placeholder={fieldValue}
            value={fieldValue}
            onChange={(e) => {
              onChangeValue(+e.target.value, fieldKey, sourceData);
            }}
            className="max-w-xs"
          />
        );
      case DataType.BOOLEAN:
        return (
          <Select
            defaultValue={fieldValue}
            onValueChange={(val) => {
              onChangeValue(val, fieldKey, sourceData);
            }}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder={true} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={true as unknown as string}>true</SelectItem>
              <SelectItem value={false as unknown as string}>false</SelectItem>
            </SelectContent>
          </Select>
        );
    }
  };

  const onChangeAllow = (uniqueKey: string) => {
    allowMap[uniqueKey] = !allowMap[uniqueKey];
    setAllowMap({ ...allowMap });
  };
  const defaultLevel = 1;

  const renderJsonConfig = (
    sourceData: any,
    deepLevel: number = defaultLevel,
    parentUniqueKey: string = `${deepLevel}`,
    fullKeyNotation: string = ""
  ) => {
    const keyList = Object.keys(sourceData);

    if (!keyList.length) {
      return (
        <AddItem
          uniqueKey={"defaultKey"}
          deepLevel={deepLevel}
          sourceData={sourceData}
        />
      );
    }

    return (
      <Table>
        {keyList.map((fieldKey, index) => {
          const uniqueKey = `${parentUniqueKey}-${index}`;
          const fieldValue = sourceData[fieldKey];

          const currentFullKeyNotation = fullKeyNotation
            ? `${fullKeyNotation}.${fieldKey}`
            : fieldKey;

          const editableKey = fieldKey;

          return (
            <>
              <TableHeader>
                <TableRow>
                  {!!isObject(fieldValue) && (
                    <TableHead className=""></TableHead>
                  )}
                  <TableHead>Key</TableHead>
                  {!allowMap[uniqueKey] && (
                    <TableHead className="text-center">Value</TableHead>
                  )}
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={uniqueKey} className="relative">
                  {!!isObject(fieldValue) && (
                    <TableCell className="align-top">
                      <CollapsePart
                        uniqueKey={uniqueKey}
                        fieldValue={fieldValue}
                      />
                    </TableCell>
                  )}
                  <TableCell className="align-top space-y-2">
                    <Input
                      addon={fullKeyNotation ? fullKeyNotation + "." : ""} // Shows nested paths
                      className="max-w-xs"
                      placeholder={editableKey}
                      value={editableKey}
                      onChange={(event) =>
                        onChangeKey(event, fieldKey, uniqueKey, sourceData)
                      }
                    />
                  </TableCell>
                  {!allowMap[uniqueKey] && (
                    <TableCell className="align-top space-y-2">
                      {getValue(
                        fieldValue,
                        fieldKey,
                        sourceData,
                        deepLevel,
                        uniqueKey,
                        currentFullKeyNotation
                      )}
                    </TableCell>
                  )}
                  <TableCell className="align-top flex justify-center w-full">
                    <ToolsView
                      uniqueKey={uniqueKey}
                      fieldValue={fieldValue}
                      fieldKey={fieldKey}
                      sourceData={sourceData}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </>
          );
        })}
        <div>
          <AddItem
            key={parentUniqueKey}
            uniqueKey={parentUniqueKey}
            deepLevel={deepLevel}
            sourceData={sourceData}
          />
        </div>
      </Table>
    );
  };

  return (
    <ConfigContext.Provider
      value={{
        editObject,
        setEditObject,

        onChangeType,
        onClickDelete,
        onChangeAllow,
        allowMap,
      }}
    >
      {renderJsonConfig(editObject)}
    </ConfigContext.Provider>
  );
}

export default JsonView;
