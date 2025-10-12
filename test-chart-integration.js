// Test script to verify chart integration
console.log("🧪 Testing Chart Integration...\n");

// Test 1: Check if chart.js dependencies are installed
try {
  const chartJs = require("chart.js");
  const reactChartJs2 = require("react-chartjs-2");
  console.log("✅ Chart.js dependencies loaded successfully");
  console.log("   - Chart.js version:", chartJs.version);
} catch (error) {
  console.log("❌ Chart.js dependencies not found:", error.message);
}

// Test 2: Mock data structure validation
try {
  const {
    generateMockForecast,
    mockDepartments,
  } = require("./lib/mockData.ts");

  console.log("\n✅ Testing chart data generation...");
  const testDepartment = mockDepartments[0];
  const result = generateMockForecast(testDepartment);

  console.log("   - Department:", testDepartment);
  console.log("   - Forecasts generated:", result.forecasts.length);
  console.log(
    "   - Chart data quarters:",
    result.chartData.quarters.join(", ")
  );
  console.log("   - Actual totals:", result.chartData.actualTotals);
  console.log("   - Forecasted totals:", result.chartData.forecastedTotals);
  console.log("   - Seasonal effect:", result.seasonalEffect);

  // Validate chart data structure
  const hasRequiredData =
    result.chartData.quarters.length === 4 &&
    result.chartData.actualTotals.length === 4 &&
    result.chartData.forecastedTotals.length === 4;

  if (hasRequiredData) {
    console.log("✅ Chart data structure is valid");
  } else {
    console.log("❌ Chart data structure is invalid");
  }
} catch (error) {
  console.log("❌ Mock data test failed:", error.message);
}

// Test 3: Department-specific chart data
console.log("\n✅ Testing department-specific data...");
try {
  const {
    generateMockForecast,
    mockDepartments,
  } = require("./lib/mockData.ts");

  mockDepartments.forEach((dept) => {
    const result = generateMockForecast(dept);
    const totalActual = result.chartData.actualTotals.reduce(
      (sum, val) => sum + val,
      0
    );
    const totalForecasted = result.chartData.forecastedTotals.reduce(
      (sum, val) => sum + val,
      0
    );

    console.log(
      `   - ${dept}: Actual ₱${(totalActual / 1000).toFixed(
        0
      )}k, Forecasted ₱${(totalForecasted / 1000).toFixed(0)}k`
    );
  });
} catch (error) {
  console.log("❌ Department-specific test failed:", error.message);
}

console.log("\n🎉 Chart integration tests completed!");
console.log("\n📊 Chart Features:");
console.log("   - Interactive line chart with actual vs forecasted data");
console.log("   - Department-specific seasonal patterns");
console.log("   - Dynamic YoY seasonal effect calculation");
console.log("   - Responsive design with tooltips");
console.log("   - Real-time updates when changing departments");
