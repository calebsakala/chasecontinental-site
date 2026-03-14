const SnakeBorder = ({ variant = "thin-2xl" }: { variant?: "thick" | "thin-2xl" | "thin-xl" }) => {
  return (
    <svg className="snake-svg" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        className={
          variant === "thick"
            ? "stroke-[6] [rx:24] [ry:24]"
            : variant === "thin-xl"
            ? "stroke-[2] [rx:12] [ry:12]"
            : "stroke-[2] [rx:16] [ry:16]"
        }
      />
    </svg>
  );
};

export default SnakeBorder;
