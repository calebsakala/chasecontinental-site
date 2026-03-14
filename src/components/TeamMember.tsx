import { Linkedin, Twitter } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

const TeamMember = ({ name, role, bio, image, linkedin, twitter }: TeamMemberProps) => {
  return (
    <div className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
      {/* Glow behind */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-gold/30">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold font-heading text-foreground">{name}</h3>
        <p className="text-sm text-gold font-medium mt-1">{role}</p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
          {bio}
        </p>
        <div className="mt-4 flex gap-2">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border p-2 text-muted-foreground hover:text-gold hover:border-gold transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border p-2 text-muted-foreground hover:text-gold hover:border-gold transition-colors"
              aria-label={`${name}'s Twitter`}
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
