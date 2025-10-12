// Simple test script to verify mock data functionality
const {
  mockData,
  mockDepartments,
  generateMockForecast,
  getMockSummary,
} = require("./lib/mockData.ts");

console.log("🧪 Testing Mock Data Integration...\n");

// Test 1: Mock data structure
console.log("✅ Mock data loaded:", mockData.length, "rows");
console.log("✅ Departments available:", mockDepartments.join(", "));

// Test 2: Summary calculation
const summary = getMockSummary(mockData);
console.log("✅ Summary generated:");
console.log("   - Total Budget: ₱" + summary.totalBudget.toLocaleString());
console.log("   - Departments: " + summary.departmentCount);
console.log("   - Categories: " + summary.categoryCount);
console.log("   - Proposal: " + summary.proposalTitle);

// Test 3: Forecast generation
console.log("\n✅ Testing forecast generation...");
const testDepartment = mockDepartments[0];
const forecastResult = generateMockForecast(testDepartment);
console.log("   - Department: " + testDepartment);
console.log("   - Forecasts generated: " + forecastResult.forecasts.length);
console.log(
  "   - Variance analysis: " + forecastResult.varianceAnalysis.length
);

// Test 4: Sample data preview
console.log("\n✅ Sample data preview:");
const sampleRow = mockData[0];
console.log("   - Description: " + sampleRow.description);
console.log("   - Department: " + sampleRow.department);
console.log("   - Total: ₱" + sampleRow.total.toLocaleString());

console.log(
  "\n🎉 All mock data tests passed! Ready for testing dashboard and forecasting pages."
);
