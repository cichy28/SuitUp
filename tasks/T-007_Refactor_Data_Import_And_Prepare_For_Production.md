# Refactor Data Import and Prepare for Production

**Task Number:** T-007

## 1. Description

This task involves refactoring the data import and generation script to prepare for production. The current script needs to be updated to support a more centralized and flexible data structure. This will involve changes to the directory layout, the format of `product_metadata.json`, and the logic of the import script itself. Additionally, this task will lay the groundwork for future integration with an image generation API.

## 2. Acceptance Criteria

- [ ] The data import script is updated to support the new directory structure.
- [ ] The `product_metadata.json` file is updated to include the new format for defining properties, variants, and hotspot positions.
- [ ] The import script correctly creates and associates properties, variants, and SKUs based on the new data structure.
- [ ] The script is able to handle company-level properties and product-specific property configurations.
- [ ] The task includes a plan for integrating with an image generation API in the future.

## 3. Technical Details & Implementation Notes

### New Directory Structure

The new directory structure will be as follows:

```
_do_importu/
└───{company_name}/
    ├───WLASCIWOSCI/
    │   └───{property_name}/
    │       └───{variant_name}.jpg
    └───PRODUKTY/
        └───{product_name}/
            ├───product_metadata.json
            ├───main.jpg
            └───WARIANTY/
                └───{sku_name}.jpg
```

### Updated `product_metadata.json`

The `product_metadata.json` file will be updated to include the following structure:

```json
{
  "name": "PRODUCT_LEMANSKA_01",
  "basePrice": 100.00,
  "properties": [
    {
      "name": "KOLOR",
      "hotspotX": 0.2,
      "hotspotY": 0.3,
      "variants": [
        {
          "name": "RED",
          "priceAdjustment": 10.00
        },
        {
          "name": "WHITE",
          "priceAdjustment": 0.00
        }
      ]
    },
    {
      "name": "ROZMIAR",
      "hotspotX": 0.5,
      "hotspotY": 0.6,
      "variants": [
        {
          "name": "L",
          "priceAdjustment": 20.00
        },
        {
          "name": "M",
          "priceAdjustment": 15.00
        }
      ]
    }
  ]
}
```

### Image Generation API Integration

The next step will be to integrate with an image generation API. This API will be responsible for creating SKU images based on the base product image, a 3D model (if available), and the selected variant images. The API will receive a request with the necessary data and return the generated image, which will then be saved and associated with the corresponding SKU.

- **Affected Files:**
    - `backend/scripts/mass-import-images.ts`
    - `_do_importu/Lemanska/PRODUCT_LEMANSKA_01/product_metadata.json`

## 4. Gemini Analysis

### Plan:

1.  **Update the `mass-import-images.ts` script:**
    - Modify the script to read the new directory structure.
    - Update the logic to parse the new `product_metadata.json` format.
    - Implement the creation of company-level properties and product-specific property configurations.
    - Ensure that SKUs are generated correctly based on the defined properties and variants.
2.  **Update the `product_metadata.json` files:**
    - Create new `product_metadata.json` files for each product with the updated format.
    - Ensure that the hotspot positions and price adjustments are correctly defined for each property and variant.
3.  **Prepare for image generation API integration:**
    - Define the API contract for the image generation service.
    - Create a placeholder function in the import script to simulate the API call.
    - Add a section to the task documentation outlining the plan for the API integration.
