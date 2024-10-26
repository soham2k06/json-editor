import React, { useState } from "react";
import { getKeyList, getQuoteAddress, getTypeString } from "@/lib/utils";
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
    parentUniqueKey: string
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
          />
        );
      case DataType.OBJECT:
        return (
          <span>
            {renderJsonConfig(fieldValue, deepLevel + 1, parentUniqueKey)}
          </span>
        );
      case DataType.STRING:
        return (
          <Input
            addon="Value"
            value={fieldValue}
            placeholder="value"
            onChange={(e) =>
              onChangeValue(e.target.value, fieldKey, sourceData)
            }
          />
        );
      case DataType.NUMBER:
        return (
          <Input
            type="number"
            addon="Value"
            placeholder={fieldValue}
            value={fieldValue}
            onChange={(e) => {
              onChangeValue(+e.target.value, fieldKey, sourceData);
            }}
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
            <SelectTrigger>
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
    parentUniqueKey: string = `${deepLevel}`
  ) => {
    const keyList = Object.keys(sourceData);
    if (!keyList.length) {
      return (
        <div style={{ marginLeft: "20px" }}>
          <AddItem
            uniqueKey={"defaultKay"}
            deepLevel={deepLevel}
            sourceData={sourceData}
          />
        </div>
      );
    }
    return (
      <div
        className="object-content"
        style={{ marginLeft: defaultLevel === deepLevel ? "0" : "20px" }}
      >
        <div style={{ marginTop: "10px" }}>
          {keyList.map((fieldKey, index) => {
            const uniqueKey = `${parentUniqueKey}-${index}`;
            const fieldValue = sourceData[fieldKey];
            return (
              <div key={uniqueKey} className="mb-1 flex gap-1">
                <CollapsePart uniqueKey={uniqueKey} fieldValue={fieldValue} />
                <div className="relative w-full mb-1">
                  <span className="json-key">
                    <Input
                      addon="Key"
                      placeholder={fieldKey}
                      value={fieldKey}
                      onChange={(event) =>
                        onChangeKey(event, fieldKey, uniqueKey, sourceData)
                      }
                    />
                  </span>
                  {!allowMap[uniqueKey] && (
                    <span className="json-value">
                      {getValue(
                        fieldValue,
                        fieldKey,
                        sourceData,
                        deepLevel,
                        uniqueKey
                      )}
                    </span>
                  )}
                  <ToolsView
                    uniqueKey={uniqueKey}
                    fieldValue={fieldValue}
                    fieldKey={fieldKey}
                    sourceData={sourceData}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <AddItem
            key={parentUniqueKey}
            uniqueKey={parentUniqueKey}
            deepLevel={deepLevel}
            sourceData={sourceData}
          />
        </div>
      </div>
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
