import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { anOldHope, CopyBlock } from "react-code-blocks";

function JsonDialog({ json }: { json: Record<string, any> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Show JSON</Button>
      </DialogTrigger>
      <DialogContent className="max-h-full">
        <DialogHeader>
          <DialogTitle>JSON Data</DialogTitle>
        </DialogHeader>
        <CopyBlock
          text={JSON.stringify(json, null, 2)}
          language="typescript"
          showLineNumbers
          theme={anOldHope}
          customStyle={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default JsonDialog;
