import { notFound } from "next/navigation";
import { getResult } from "@/lib/storage";
import ResultView from "./ResultView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = getResult(id);
  if (!result) return { title: "Result Not Found" };
  return {
    title: `Car in ${result.targetColor} — Car Color Visualizer`,
    description: `See this car visualized in ${result.targetColor}`,
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = getResult(id);
  if (!result) notFound();

  return <ResultView result={result} />;
}
