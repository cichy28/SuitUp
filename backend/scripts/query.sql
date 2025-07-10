SELECT
  p.id AS product_id,
  p.name AS product_name,
  p."basePrice" AS product_base_price,
  ps.id AS sku_id,
  ps."skuCode" AS sku_code,
  ps.price AS sku_price,
  ps."priceMultiplier" AS sku_price_multiplier,
  pv.id AS variant_id,
  pv.name AS variant_name,
  pv."priceAdjustment" AS variant_price_adjustment
FROM "Product" AS p
LEFT JOIN "ProductSku" AS ps ON p.id = ps."productId"
LEFT JOIN "ProductSkuPropertyVariant" AS pspv ON ps.id = pspv."productSkuId"
LEFT JOIN "PropertyVariant" AS pv ON pspv."propertyVariantId" = pv.id
WHERE p.id = 'cmcwdsy810048d9j1jcpdi9n5';