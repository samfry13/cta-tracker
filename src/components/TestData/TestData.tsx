"use client";

import { useState } from "react";
import { trpc } from "~/lib/trpc";

const useRandomNumber = () => {
  const [currentNumber, setCurrentNumber] = useState(Infinity);

  trpc.randomNumber.useSubscription(undefined, {
    onData(newNumber) {
      setCurrentNumber(newNumber);
    },
  });

  return currentNumber;
};

export const TestData = () => {
  const randomNumber = useRandomNumber();

  const { data } = trpc.train.positions.useQuery();

  return (
    <div>
      <p>Test Subscription: {randomNumber.toFixed(2)}</p>
      <p>Test Train Data:</p>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};
