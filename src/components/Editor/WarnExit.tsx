import React, { useEffect, useState } from "react";
import { useChart } from "./chart-context";

const handleBeforeunload = (evt) => {
  evt.preventDefault()
  evt.returnValue = "You have unsaved changes"
}

export default function WarnExit({ }) {
  const { dirty } = useChart()
  useEffect(() => {
    if (dirty) {
      window.addEventListener('beforeunload', handleBeforeunload);
      return () => window.removeEventListener('beforeunload', handleBeforeunload)
    }
  }, [dirty])

  return (
    null
  );
}