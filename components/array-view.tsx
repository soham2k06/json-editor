import React, { useContext } from "react";
import { ConfigContext } from "@/contexts/config-context";
import AddItem from "./add-item";
import CollapsePart from "./collapse";
import ToolsView from "./tools-view";

type Props = {
  fieldValue: any[];
  fieldKey: string;
  sourceData: any;
  getValue: any;
  deepLevel: number;
  parentUniqueKey: string;
  fullKeyNotation: string;
};

function ArrayView(props: Props) {
  const { allowMap } = useContext(ConfigContext);
  return (
    <>
      {props.fieldValue.map((item: any, index: number) => {
        const uniqueKey = `${props.parentUniqueKey}-${index}`;
        return (
          <div className="relative space-y-2" key={uniqueKey}>
            <span className="inline-flex items-center gap-1">
              <span>{index + 1}.</span>
              <CollapsePart uniqueKey={uniqueKey} fieldValue={item} />
            </span>

            {!allowMap[uniqueKey] ? (
              <div className="json-value w-full">
                {props.getValue(
                  item,
                  index,
                  props.fieldValue,
                  props.deepLevel + 1,
                  uniqueKey,
                  props.fullKeyNotation
                )}
              </div>
            ) : (
              <span>Collapsed</span>
            )}
            <ToolsView
              uniqueKey={uniqueKey}
              fieldValue={item}
              fieldKey={`${index}`}
              sourceData={props.fieldValue}
            />
          </div>
        );
      })}
      <AddItem
        key={props.parentUniqueKey}
        uniqueKey={props.parentUniqueKey}
        deepLevel={props.deepLevel}
        sourceData={props.fieldValue}
      />
    </>
  );
}
export default ArrayView;
