# Mock Data Implementation for Testing

## Overview

This document describes the mock data implementation that replaces the Prisma database integration for testing the dashboard and forecasting pages.

## Files Modified

### 1. `lib/mockData.ts` (NEW)

- **Purpose**: Centralized mock data service
- **Contents**:
  - 15 sample budget line items across 5 departments
  - Mock departments list
  - Mock forecast generation function
  - Summary calculation utilities
  - TypeScript type definitions

### 2. `app/(private)/datamanagement/page.tsx`

- **Changes**:
  - Commented out Prisma API calls
  - Added mock data loading on component mount
  - Simulated file upload with mock data
  - Added mock upload success messages

### 3. `app/(private)/forecasting/page.tsx`

- **Changes**:
  - Commented out department fetching API calls
  - Added mock departments loading
  - Replaced forecast generation API with mock function
  - Added simulated API delays for realistic UX

### 4. `app/(private)/dashboard/page.tsx`

- **Changes**:
  - Commented out API imports
  - Added real-time statistics calculation from mock data
  - Dynamic department spending calculations
  - Variance analysis based on mock data

## Mock Data Structure

### Departments

- IT
- Engineering
- Marketing
- Administration
- SHS (Senior High School)

### Sample Data Categories

- Operating Expenses
- Technology
- Human Resources
- R&D
- Marketing
- Capital Expenditure
- Professional Services
- Student Services
- Educational Resources
- Infrastructure

### Key Features

1. **Realistic Budget Values**: ₱25K - ₱230K per line item
2. **Quarterly Distribution**: Varying quarterly allocations
3. **Department Variety**: 5 different departments with different spending patterns
4. **Forecast Generation**: Mock Holt-Winters algorithm simulation
5. **Variance Analysis**: 15% threshold for variance warnings

## Testing Features

### Data Management Page

- ✅ Mock data loads automatically on page load
- ✅ File upload simulation with realistic delay
- ✅ Success messages with budget summaries
- ✅ Data table display with all columns

### Forecasting Page

- ✅ Department dropdown populated with mock departments
- ✅ Forecast generation with configurable parameters
- ✅ Mock variance analysis
- ✅ Results table with forecasted values
- ✅ Loading states and error handling

### Dashboard Page

- ✅ Real-time budget calculations
- ✅ Department spending rankings
- ✅ Variance watchlist items
- ✅ Dynamic statistics based on mock data

## How to Test

1. **Start the development server**:

   ```bash
   cd forecasting
   npm run dev
   ```

2. **Navigate to Data Management**:

   - Should see 15 mock budget items loaded automatically
   - Try uploading a file to see the mock upload simulation

3. **Navigate to Forecasting**:

   - Select different departments from dropdown
   - Adjust forecasting parameters
   - Click "Run Forecast" to generate mock forecasts

4. **Navigate to Dashboard**:
   - View dynamic statistics calculated from mock data
   - Check department spending rankings
   - Review variance watchlist items

## Reverting to Database Integration

To restore Prisma database integration:

1. Uncomment the API imports in all modified files
2. Remove mock data imports
3. Restore original useEffect hooks and API calls
4. Remove mock data simulation code
5. Delete `lib/mockData.ts` file

## Benefits of Mock Data Implementation

1. **No Database Dependency**: Test frontend without backend setup
2. **Consistent Data**: Same test data across all sessions
3. **Realistic Scenarios**: Comprehensive test cases
4. **Fast Development**: No API delays during development
5. **Easy Debugging**: Predictable data for troubleshooting

## Next Steps

1. Test all three pages thoroughly
2. Verify UI responsiveness with mock data
3. Check error handling scenarios
4. Validate forecast calculations
5. Test different user interactions

---

**Note**: This mock data implementation is for testing purposes only. Production deployment should use the actual Prisma database integration.
