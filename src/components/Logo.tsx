import Link from "next/link";

// PNG dimensions and measured content bbox (transparent padding excluded)
const IMG_W = 600, IMG_H = 300;
const C_LEFT = 153, C_TOP = 92, C_RIGHT = 465, C_BOTTOM = 191;
const C_W = C_RIGHT - C_LEFT;   // 312
const C_H = C_BOTTOM - C_TOP;   // 99

// Aspect ratio of visible content
const ASPECT = C_W / C_H; // ≈ 3.15

type Variant = "animated" | "dark" | "white";

const SRC: Record<Exclude<Variant, "animated">, string> = {
  dark:  "/logo-dark.png",
  white: "/logo-white.png",
};

type Props = {
  variant?: Variant;
  height?: number;
  href?: string | null;
  className?: string;
};

export function Logo({ variant = "animated", height = 28, href = "/", className = "" }: Props) {
  const width = Math.round(height * ASPECT);

  // Scale the full PNG so its content region fills the container height
  const imgH = Math.round(height * IMG_H / C_H);
  const imgW = Math.round(imgH * IMG_W / IMG_H);

  // Offset so the content center aligns with the container center
  const posX = Math.round(width / 2 - ((C_LEFT + C_RIGHT) / 2 / IMG_W) * imgW);
  const posY = Math.round(height / 2 - ((C_TOP + C_BOTTOM) / 2 / IMG_H) * imgH);

  const content =
    variant === "animated" ? (
      <div
        aria-label="alizee"
        style={{
          width,
          height,
          flexShrink: 0,
          background: "linear-gradient(90deg, #F97316 0%, #E91E8C 50%, #F97316 100%)",
          backgroundSize: "200% 100%",
          WebkitMaskImage: "url(/logo-dark.png)",
          WebkitMaskSize: `${imgW}px ${imgH}px`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: `${posX}px ${posY}px`,
          maskImage: "url(/logo-dark.png)",
          maskSize: `${imgW}px ${imgH}px`,
          maskRepeat: "no-repeat",
          maskPosition: `${posX}px ${posY}px`,
          animation: "logo-shimmer 2.4s linear infinite",
        }}
        className={className}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={SRC[variant]}
        alt="alizee"
        width={width}
        height={height}
        style={{ height, width }}
        className={className}
      />
    );

  return href ? <Link href={href}>{content}</Link> : content;
}
