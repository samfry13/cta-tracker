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

  return <div>Test Data: {randomNumber.toFixed(2)}</div>;
};
