type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: SectionHeadingProps) {
  const textAlign = align === "center" ? "text-center items-center" : "text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${textAlign}`}>
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-white/65 sm:text-lg">{body}</p>
    </div>
  );
}
