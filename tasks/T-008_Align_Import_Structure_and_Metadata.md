# Align `_do_importu` Structure and `product_metadata.json` with T-007 Specification

**Task Number:** T-008

## 1. Description

The current structure of the `_do_importu` directory and the content of `product_metadata.json` files do not fully align with the specifications outlined in `T-007_Refactor_Data_Import_And_Prepare_For_Production.md`. This task aims to rectify these discrepancies to ensure the data import process functions as intended and is ready for production.

## 2. Acceptance Criteria

- [ ] All property images (e.g., `G1.jpg`, `BLACK.jpg`) are moved from the root `WLASCIWOSCI` directory to their respective company-specific and property-specific directories: `_do_importu/{company_name}/WLASCIWOSCI/{property_name}/{variant_name}.jpg`.
- [ ] Each product directory (`_do_importu/{company_name}/PRODUKTY/{product_name}/`) contains a `main.jpg` file (placeholder if necessary).
- [ ] Each product directory (`_do_importu/{company_name}/PRODUKTY/{product_name}/`) contains a `WARIANTY` subdirectory.
- [ ] The `WARIANTY` subdirectory for each product contains placeholder `sku_name.jpg` files for each expected SKU.
- [ ] All `product_metadata.json` files are updated to include a top-level `name` field, matching the product's directory name.
- [ ] Clarification is provided regarding the `suitableFor` and `style` fields in `product_metadata.json`. If they are still required, they should be explicitly added to the `T-007` specification or removed from the current `product_metadata.json` files if no longer needed.

## 3. Technical Details & Implementation Notes

- **Image Relocation:** This will involve manually moving image files and potentially updating paths in any related scripts that reference these images.
- **Placeholder Creation:** For `main.jpg` and `sku_name.jpg`, simple placeholder images can be created if actual images are not yet available.
- **`product_metadata.json` Update:** A script or manual process will be needed to add the `name` field to existing `product_metadata.json` files.
- **Clarification on `suitableFor` and `style`:** This will require a discussion with the product owner or a review of the application's requirements to determine the necessity of these fields.

## 4. Affected Files

- `_do_importu/**` (various image and `product_metadata.json` files)
- Potentially `backend/scripts/mass-import-images.ts` if it needs to adapt to the new `product_metadata.json` structure regarding `suitableFor` and `style`.
