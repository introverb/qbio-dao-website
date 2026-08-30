// Single source of truth for the DAO team roster, shared by the homepage
// "Meet the team" grid and the community page's "Core Contributors + Other
// Roles" grid. Order + titles per Olli's 2026-08 spec (Geoff, Ale, Clarice,
// Kyra, Jen, then the rest).
//
// Card treatment is driven by which fields are present:
//   img + bio  -> interactive card with a "Read bio" dialog
//   img only   -> static photo card (bio pending)
//   icon only  -> quantum line-icon placeholder (photo + bio pending);
//                 the icon names map to components/v2/QuantumIcon.astro
// To slot in new assets, just fill in the missing fields here.
export interface TeamMember {
  name: string;
  role: string;
  img?: string;
  /** Short one-liner shown on the homepage card (interactive cards only). */
  summary?: string;
  /** Full bio for the dialog. Verbatim — Kyra owns copy edits. */
  bio?: string;
  /** Placeholder icon while no photo exists. */
  icon?: "atom" | "molecule" | "spin" | "wave";
}

export const teamMembers: TeamMember[] = [
  {
    name: "Dr. Geoff Anders",
    role: "Co-founder, Leader of Governance Working Group",
    img: "/images/team/geoff.jpeg",
    summary:
      "CEO of the Quantum Biology Institute and founder of Leverage, focused on supporting revolutionary scientific research.",
    bio: "Geoff Anders is the founder and CEO of Leverage, a research institute established in 2011 to support revolutionary scientific research. With a background in philosophy and social science, he leads Leverage's internal research and helps external research teams organize to make important scientific breakthroughs. His recent work focuses on the intersection of philosophy, science, and history, as it pertains especially to introspection, cognitive science, and artificial intelligence. Geoff is now the CEO of the Quantum Biology Institute and holds a PhD in Philosophy from Rutgers University and a BS in Economics from the Wharton School at the University of Pennsylvania.",
  },
  {
    name: "Dr. Alessandro Lodesani",
    role: "Co-founder, CTO at QBI",
    img: "/images/team/ale.jpeg",
    summary:
      "COO of the Quantum Biology Institute, designing innovative lab equipment and optimizing research operations.",
    bio: "Alessandro Lodesani is the Institute's Chief Operating Officer, overseeing its daily research operations. With a strong background in physics and engineering, combined with extensive experience in biology research, Alessandro focuses on designing innovative devices and optimizing lab processes. Originally from Italy, Alessandro earned a Bachelor's in Mechanical Engineering and a PhD in Physics, graduating with honors from the Polytechnic University of Milan, with a specialization in spintronics and molecular interfaces. His previous research at MIT focused on topological qubits and superconducting thin films, where he successfully developed the world's most efficient superconducting diode platform. Alessandro then joined the Institute in its early days at UCLA, where he led several projects investigating the influence of weak magnetic fields on biological systems.",
  },
  {
    name: "Dr. Clarice D. Aiello",
    role: "Co-founder, CSO at QBI",
    img: "/images/team/clarice.jpeg",
    summary:
      "Quantum engineer exploring how quantum physics informs biology at the nanoscale.",
    bio: "Clarice is a quantum engineer interested in how quantum physics informs biology at the nanoscale. Born and raised in Brazil, Clarice obtained a Diplome d'Ingenieur in Physics from the Ecole Polytechnique in France and an M.Phil. in Physics from the University of Cambridge, Trinity College, in England; she received her Ph.D. from MIT in Electrical Engineering. She further held postdoctoral appointments in Bioengineering at Stanford, and in Chemistry at Berkeley.",
  },
  {
    name: "Kyra Gardner",
    role: "Media Director, Leader of Communications Working Group",
    img: "/images/team/kyra.jpeg",
    summary:
      "Communications Working Group Leader and co-founder of Smarter with Science, connecting complex topics to broader audiences.",
    bio: "Kyra Gardner is the Communications Working Group Leader for the Quantum Biology DAO, where she manages communications and social media. She joined the DAO in January of 2025 and carries out this work through Smarter with Science, a company she co-founded whose team members are also deeply involved in the quantum biology ecosystem. Despite not having as technical of a science background as some of her DAO peers, she enjoys finding ways to connect complex topics to everyday life and make them accessible to broader audiences.",
  },
  {
    name: "Jennilyn Gaitan",
    role: "QBI Liaison",
    img: "/images/team/jen.jpeg",
    summary:
      "Operations and administration lead for the Quantum Biology Institute, with two decades of experience refining systems and processes.",
    bio: "Jennilyn Gaitan graduated with a Bachelor of Science in Electronic Media and Film from Towson University. Since 2004, she has worked in various administrative and operational roles across multiple industries, including retail, higher education, photography, real estate, and small business operations. Jennilyn has a passion for creating and refining the systems and processes that businesses use, to run most efficiently, which has been a hallmark of her career. In November 2023, Jennilyn joined the Quantum Biology Institute, contributing her expertise to the administration and operations of the Institute.",
  },
  { name: "Jonathan Heppner", role: "Science Working Group Leader", icon: "atom" },
  { name: "Eren Targ", role: "Product Working Group leader", icon: "molecule" },
  { name: "Olli Payne", role: "Discord Manager", img: "/images/team/olli.jpeg" },
  {
    name: "Oliver Carefull",
    role: "IP Working Group Leader",
    img: "/images/team/oliver.jpeg",
  },
  { name: "Cryptonurse", role: "Head Moderator", icon: "spin" },
  { name: "DePaul", role: "Telegram Manager", icon: "wave" },
];
