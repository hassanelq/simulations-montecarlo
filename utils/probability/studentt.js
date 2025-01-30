import { processContinuousData } from "./stats";

export default function simulateStudentT({ nu, N }) {
  const rawData = Array.from({ length: N }, () => {
    const z = Math.sqrt(nu / (2 * Math.random() - 1) ** 2);
    return z * (Math.random() < 0.5 ? -1 : 1);
  });

  return processContinuousData(rawData, `Student's t (ν=${nu})`);
}
