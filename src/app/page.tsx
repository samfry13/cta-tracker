import { TestData } from "~/components/TestData/TestData";
import { caller } from "~/server/routers/_app";

export default async function Home() {
  const response = await caller.healthcheck();

  return (
    <div>
      Home Page: {response}
      <TestData />
    </div>
  );
}
