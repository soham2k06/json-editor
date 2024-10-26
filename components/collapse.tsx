import React, { useContext } from "react";
import { cn, isObject } from "@/lib/utils";
import { ConfigContext } from "@/contexts/config-context";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  uniqueKey: string;
  fieldValue: any;
};

function CollapsePart(props: Props) {
  const { fieldValue, uniqueKey } = props;
  const { onChangeAllow, allowMap } = useContext(ConfigContext);
  if (!isObject(fieldValue)) return <span></span>;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onChangeAllow(uniqueKey)}
    >
      <ChevronDown
        className={cn({
          "cursor-pointer": true,
          "transform -rotate-90": allowMap[uniqueKey],
        })}
      />
    </Button>
  );
}
export default CollapsePart;
