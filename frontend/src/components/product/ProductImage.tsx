import { ImageOff, Package } from "lucide-react";
import { useState } from "react";

import type { Product } from "../../types/product";

type ProductImageProps = {
  product: Pick<Product, "name" | "image_url">;
  className?: string;
  iconSize?: number;
};

export function ProductImage({ product, className = "h-16 w-16", iconSize = 20 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(product.image_url && !failed);

  return (
    <div className={`${className} relative shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055]`}>
      {hasImage ? (
        <img
          src={product.image_url ?? undefined}
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
