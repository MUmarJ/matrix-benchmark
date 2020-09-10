// Homework 1 for CS402 Fall 2020 by Muhammad Umar

// const { performance } = require("perf_hooks");
const createMatrix = (rows = 2, columns = 3) => {
  const matrix = new Array(rows);
  for (let row = 0; row < rows; row++) {
    matrix[row] = new Array(columns);
  }
  return matrix;
};

const randomizeMatrix = (matrix, real = false) => {
  const rows = matrix.length;
  for (let row = 0; row < rows; row++) {
    const columns = matrix[row].length;
    for (let column = 0; column < columns; column++) {
      const randomNumber = real
        ? BigInt(Math.floor(Math.random() * 100))
        : Math.random() * 100;
      matrix[row][column] = randomNumber;
    }
  }
  return matrix;
};

const multiplyMatrices = (matrixA, matrixB, real, innerLoop = "column") => {
  // rA x cA * rB x cB -> rA x cB
  // 2 x 3 * 3 x 2 = 2 x 2
  const rowsA = matrixA.length;
  const columnsA = matrixA[0].length;

  const rowsB = matrixB.length;
  const columnsB = matrixB[0].length;

  let sum = real ? 0n : 0;

  // Prepare matrix of new size
  const resultantMatrix = createMatrix(rowsA, columnsB);

  // Do matrix multiplication with conditional innerLoop, defaulting to column if not specified
  switch (innerLoop) {
    case "row":
      for (let row = 0; row < rowsA; row++) {
        for (let column = 0; column < columnsB; column++) {
          for (let index = 0; index < rowsB; index++) {
            const firstValue = matrixA[row][index];
            const secondValue = matrixB[index][column];
            sum += firstValue * secondValue;
          }
          resultantMatrix[row][column] = sum;
        }
      }
      break;

    case "column":
    default:
      for (let row = 0; row < rowsA; row++) {
        for (let column = 0; column < columnsB; column++) {
          for (let index = 0; index < columnsA; index++) {
            const firstValue = matrixA[row][index];
            const secondValue = matrixB[index][column];
            sum += firstValue * secondValue;
          }
          resultantMatrix[row][column] = sum;
        }
      }
      break;
  }
  return resultantMatrix;
};

const setElement = (selector, attribute, val) => {
  elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.setAttribute(attribute, val);
  });
};

const removeAttribute = (selector, attribute) => {
  elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.removeAttribute(attribute);
  });
};

function calculate(type = "integer") {
  // Disable submit buttons
  setElement(".submit-results", "disabled", true);

  // Matrix constants
  const rowsmatrixA = 400;
  const columnsmatrixA = 600;
  const rowsmatrixB = columnsmatrixA;
  const columnsmatrixB = 1000;

  // Defaults to integer type calculation unless stated
  const real = type === "real" ? true : false;
  // Number of times that the operation will run while defaulting to 1
  const benchmarkRuns = Number(
    document.getElementById("benchmark-runs").value || 1
  );
  const innerLoop =
    document.forms.algorithm.elements.approach.value || "column";
  // const benchmarkRuns = 2;

  // Generate matrices
  let matrixA = createMatrix(rowsmatrixA, columnsmatrixA);
  let matrixB = createMatrix(rowsmatrixB, columnsmatrixB);

  // ---Example matrices for testing---
  // matrixA = [
  //   [1, 2, 3],
  //   [4, 5, 6],
  // ];
  // matrixB = [
  //   [7, 8],
  //   [9, 10],
  //   [11, 12],
  // ];

  // console.table(matrixA);
  // console.table(matrixB);

  let totalTime = 0;

  // Table Selector
  const selector = real ? "real-results" : "integer-results";
  const tableBody = document.getElementById(`${selector}-table-body`);

  // Clear table body
  tableBody.innerHTML = "";

  for (let run = 0; run < benchmarkRuns; run++) {
    // Randomize matrices
    matrixA = randomizeMatrix(matrixA, real);
    matrixB = randomizeMatrix(matrixB, real);

    // Multiply integer matrices and measure
    const timeStart = performance.now();
    result = multiplyMatrices(matrixA, matrixB, real, innerLoop);
    const timeEnd = performance.now();

    //Sum time taken for each run
    const timeTaken = timeEnd - timeStart;

    totalTime += timeTaken;
    insertBenchmarkRow(tableBody, run, timeTaken);
  }
  // Enable submit buttons
  removeAttribute(".submit-results", "disabled");

  // Calculate time taken in ms
  const averageTime = totalTime / benchmarkRuns;

  // Print results
  // console.table(result);
  console.log(
    `Integer matrix multiplication took ${
      averageTime / 1000
    }s on average while the total time taken for ${benchmarkRuns} runs was ${
      totalTime / 1000
    }s using ${innerLoop} approach.`
  );

  insertResultsText(
    `${selector}-text`,
    averageTime,
    totalTime,
    benchmarkRuns,
    innerLoop
  );
}

// HTML functions
const insertResultsText = (
  selector,
  averageTime,
  totalTime,
  benchmarkRuns,
  innerLoop
) => {
  const resultsText = document.getElementById(selector);

  resultsText.innerHTML = `Matrix multiplication took <b>${
    averageTime / 1000
  }s on average</b>.
  <br>
  Total time taken for <u>${benchmarkRuns} runs</u> was <b>${
    totalTime / 1000
  }s</b> using ${innerLoop} approach.`;
};

const insertBenchmarkRow = (tableBody, run, time) => {
  // Insert a row in the table at the last row
  const newRow = tableBody.insertRow();
  newRow.innerHTML = `<td>${run + 1}</td><td>${time / 1000}s</td>`;
};

// calculate();
