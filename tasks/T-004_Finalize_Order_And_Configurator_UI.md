# Finalize Order Flow and Refactor Product Configurator UI

**Task Number:** T-004

## 1. Description

This task addresses feedback from the previous implementation (T-003). The goal is to polish the user interface, fix a critical bug in the order placement functionality, and refactor the product configurator to improve hotspot placement.

## 2. Acceptance Criteria

- [ ] The navigation layout on the `SummaryScreen` is consistent with other screens, specifically the "Back" button.
- [ ] The "Place Order" button on the `SummaryScreen` sends a correct and successful request to the backend.
- [ ] The hotspot placement logic in the `ProductConfiguratorScreen` is fixed.
- [ ] A reusable component for displaying images with interactive hotspots is created and used in both `ProductConfiguratorScreen` and `MeasurementScreen`.

## 3. Technical Details & Implementation Notes

- **Affected Files:**
  - `frontend/src/screens/SummaryScreen.tsx`
  - `frontend/src/screens/ProductConfiguratorScreen.tsx`
  - `frontend/src/screens/MeasurementScreen.tsx`
  - `frontend/src/components/InteractiveImageView.tsx` (or a new reusable component)
  - `frontend/src/navigation/AppNavigator.tsx` (potentially)

## 4. Gemini Analysis

### Plan:

1.  **Fix `SummaryScreen` UI:**

    - Analyze the navigation header implementation in `AppNavigator.tsx` and other screens to understand the standard way of rendering the "Back" button.
    - Apply the consistent navigation layout to `SummaryScreen.tsx`.

2.  **Fix "Place Order" Functionality:**

    - Investigate the current implementation of the `onPress` handler for the "Place Order" button in `SummaryScreen.tsx`.
    - Use `console.log` or a debugger to inspect the payload being sent to the backend.
    - Correct the request payload according to the backend's expectations (refer to `backend/src/routes/orders.ts` and `shared/validators/order.ts`).
    - Verify the order is successfully created in the database.

3.  **Refactor Hotspot Logic:**
    - Analyze the existing hotspot placement logic in `frontend/src/screens/MeasurementScreen.tsx` and its `InteractiveImageView.tsx` component.
    - Create a new, reusable component (e.g., `HotspotImageView`) that encapsulates the logic for displaying an image and placing hotspots based on relative coordinates.
    - This component will take the image source and a list of hotspot coordinates as props.
    - Replace the existing implementation in both `ProductConfiguratorScreen.tsx` and `MeasurementScreen.tsx` with the new reusable component.
    - Ensure the new component correctly handles different image sizes and aspect ratios.
    - Be sure that it can work correctly for `MeasurementScreen.tsx` and `ProductConfiguratorScreen.tsx`
