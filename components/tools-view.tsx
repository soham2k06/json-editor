import { ConfigContext } from "@/contexts/config-context";
import { getTypeString } from "@/lib/utils";
import { DataType } from "@/lib/constants";
import { SquareMinus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

function ToolsView(props: {
  fieldValue: any;
  fieldKey: string;
  uniqueKey: string;
  sourceData: any;
}) {
  return (
    <ConfigContext.Consumer>
      {({ onChangeType, onClickDelete }) => (
        <div className="absolute right-0 top-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onClickDelete(props.fieldKey, props.sourceData)}
          >
            <SquareMinus className="text-destructive" />
          </Button>
          <Select
            value={getTypeString(props.fieldValue)}
            onValueChange={(value) => onChangeType(value, props.uniqueKey)}
            defaultValue={getTypeString(props.fieldValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.values(DataType).map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </ConfigContext.Consumer>
  );
}
export default ToolsView;
