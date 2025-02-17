import JsonEditor from "@/components/json-editor";

const initialData = [
  {
    id: "0001",
    type: "donut",
    name: "Cake",
    ppu: 0.55,
    // batters: {
    //   batter: [
    //     { id: "1001", type: "Regular" },
    //     { id: "1002", type: "Chocolate" },
    //     { id: "1003", type: "Blueberry" },
    //     { id: "1004", type: "Devil's Food" },
    //   ],
    // },
    topping: [
      { id: "5001", type: "None" },
      { id: "5002", type: "Glazed" },
      { id: "5005", type: "Sugar" },
      { id: "5007", type: "Powdered Sugar" },
      { id: "5006", type: "Chocolate with Sprinkles" },
      { id: "5003", type: "Chocolate" },
      { id: "5004", type: "Maple" },
    ],
  },
  {
    id: "0002",
    type: "donut",
    name: "Cake",
    ppu: 0.55,
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl text-center font-bold mb-8">JSON Editor</h1>

      <JsonEditor data={initialData} />
    </div>
  );
}
