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
};

function ArrayView(props: Props) {
  const { allowMap } = useContext(ConfigContext);
  return (
    <div>
      <div className="mt-2">
        {props.fieldValue.map((item: any, index: number) => {
          const uniqueKey = `${props.parentUniqueKey}-${index}`;
          return (
            <div className="relative" key={uniqueKey}>
              <div className="flex items-center">
                <span className="json-key">{index + 1}.</span>
                <CollapsePart uniqueKey={uniqueKey} fieldValue={item} />
              </div>

              {!allowMap[uniqueKey] && (
                <div className="json-value w-full">
                  {props.getValue(
                    item,
                    index,
                    props.fieldValue,
                    props.deepLevel + 1,
                    uniqueKey
                  )}
                </div>
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
      </div>
      <div>
        <AddItem
          key={props.parentUniqueKey}
          uniqueKey={props.parentUniqueKey}
          deepLevel={props.deepLevel}
          sourceData={props.fieldValue}
        />
      </div>
    </div>
  );
}
export default ArrayView;
