import { useContext, useState } from "react";
import { Plus } from "lucide-react";

import { ConfigContext } from "@/contexts/config-context";
import { DataType, typeMap } from "@/lib/constants";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const AddItem = (props: {
  uniqueKey: string;
  sourceData: any;
  deepLevel: number;
}) => {
  const { setEditObject, editObject } = useContext(ConfigContext);
  const { uniqueKey, sourceData } = props;
  const isArray = Array.isArray(sourceData);
  const [templateData, setTemplateData] = useState<any>({});
  const [showIncreaseMap, setShowIncreaseMap] = useState<any>({});

  const onClickIncrease = (key: string, value: boolean) => {
    showIncreaseMap[key] = value;
    templateData[key] = {};
    setTemplateData({
      ...templateData,
    });
    setShowIncreaseMap({
      ...showIncreaseMap,
    });
  };

  const changeInputKey = (uniqueKey: string, event: any) => {
    templateData[uniqueKey]["key"] = event.target.value;
    setTemplateData({ ...templateData });
  };
  const changeInputValue = (uniqueKey: string, value: any) => {
    templateData[uniqueKey]["value"] = value;
    setTemplateData({ ...templateData });
  };
  const onChangeTempType = (uniqueKey: string, type: DataType) => {
    templateData[uniqueKey]["type"] = type;
    templateData[uniqueKey]["value"] = typeMap[type];
    setTemplateData({
      ...templateData,
    });
  };
  const onConfirmIncrease = (uniqueKey: any, sourceData: any) => {
    const { key: aKey, value } = templateData[uniqueKey];

    if (isArray) {
      sourceData.push(value);
    } else {
      sourceData[aKey] = value;
    }
    setEditObject({ ...editObject });
    onClickIncrease(uniqueKey, false);
  };

  const getTypeTemplate = (type: DataType) => {
    switch (type) {
      case DataType.STRING:
        return (
          <Input
            placeholder="value"
            value={templateData[uniqueKey]["value"]}
            onChange={(e) => changeInputValue(uniqueKey, e.target.value)}
          />
        );
      case DataType.NUMBER:
        return (
          <Input
            placeholder="value"
            type="number"
            value={templateData[uniqueKey]["value"]}
            onChange={(e) => changeInputValue(uniqueKey, +e.target.value)}
          />
        );
      case DataType.BOOLEAN:
        return (
          <Select
            defaultValue={true as unknown as string}
            onValueChange={(value) => {
              changeInputValue(uniqueKey, value);
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
      default:
        return null;
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="secondary"
          onClick={() => onClickIncrease(uniqueKey, true)}
          size={props.deepLevel === 1 ? "default" : "sm"}
        >
          <Plus className="size-6 text-primary" /> Add{" "}
          {isArray ? "Item" : "Property"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            New {isArray ? "Item" : "Property"} at level {props.deepLevel}
          </DialogTitle>
        </DialogHeader>
        <div className="flex mt-2" key={uniqueKey}>
          {showIncreaseMap[uniqueKey] ? (
            <div className="space-y-2 w-full">
              {!isArray && (
                <div>
                  <Input
                    value={templateData[uniqueKey]["key"]}
                    placeholder="key"
                    onChange={(event) => changeInputKey(uniqueKey, event)}
                  ></Input>
                </div>
              )}
              {getTypeTemplate(
                templateData[uniqueKey]["type"] || DataType.STRING
              )}

              <Select
                onValueChange={(value: DataType) =>
                  onChangeTempType(uniqueKey, value)
                }
                defaultValue={DataType.STRING}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DataType).map((item) => (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-x-2 flex mt-2">
                <Button
                  size="sm"
                  onClick={() => onConfirmIncrease(uniqueKey, sourceData)}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClickIncrease(uniqueKey, false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              onClick={() => onClickIncrease(uniqueKey, true)}
              size={props.deepLevel === 1 ? "default" : "sm"}
            >
              <Plus className="size-6 text-primary" /> Add{" "}
              {isArray ? "Item" : "Property"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddItem;
