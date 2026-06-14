import { ImageOff, Package } from "lucide-react";
import { useEffect, useState } from "react";

import { getUsableProductImageUrls } from "../../lib/productImages";
import type { Product } from "../../types/product";

type ProductImageProps = {
  product: Pick<Product, "name" | "image_url" | "image_urls">;
  className?: string;
  iconSize?: number;
};

export function ProductImage({ product, className = "h-16 w-16", iconSize = 20 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const usableImageUrl = getUsableProductImageUrls(product.image_url, product.image_urls)[0] ?? null;
  const hasImage = Boolean(usableImageUrl && !failed);

  useEffect(() => {
    setFailed(false);
  }, [usableImageUrl]);

  return (
    <div className={`${className} relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055]`}>
      {hasImage ? (
        <img
          src={usableImageUrl ?? undefined}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.08] to-cyan-300/[0.08] text-cyan-200">
          {product.image_url ? <ImageOff size={iconSize} /> : <Package size={iconSize} />}
        </div>
      )}
    </div>
  );
}
