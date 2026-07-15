/*
  Locally-authored articles rendered by the blog alongside Sanity posts.
  These are Charles's essays. They live in the repo (not Sanity) so they are
  readable and prerendered without needing a CMS write token. To move one into
  Sanity later, recreate it as a `post` document with the same slug and remove
  it here.
*/
import type { PortableTextBlock } from "@portabletext/react";

export interface LocalArticle {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  authorName: string;
  body: PortableTextBlock[];
}

type Pair = ["normal" | "h2", string];

function toBody(pairs: Pair[]): PortableTextBlock[] {
  return pairs.map((p, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: p[0],
    markDefs: [],
    children: [{ _type: "span", _key: `b${i}s0`, text: p[1], marks: [] }],
  })) as unknown as PortableTextBlock[];
}

const AUTHOR = "Charles K. Chirongoma";

const RAW: Array<Omit<LocalArticle, "body" | "authorName"> & { pairs: Pair[] }> = [
  {
    _id: "local-why-most-ai-projects-fail",
    title: "Why Most AI Projects Fail Inside Organizations",
    slug: { current: "why-most-ai-projects-fail-inside-organizations" },
    publishedAt: "2026-07-02T09:00:00.000Z",
    excerpt:
      "Most enterprise AI projects do not fail because the models are weak. They fail because the organization was never structured to absorb them. Here is what actually breaks, and how to fix it before you automate.",
    pairs: [
      ["normal", "The numbers are not kind. In 2025, S&P Global reported that 42% of companies abandoned most of their AI initiatives and 46% of proof-of-concepts were scrapped before production. MIT put a figure on the waste: roughly 40 billion dollars spent with near-zero measurable impact. If AI automation worked the way the demos promise, these numbers would not exist."],
      ["h2", "The failure is operational, not technical"],
      ["normal", "When an AI project dies inside an organization, the post-mortem usually blames the model. The real cause is almost always upstream. The systems do not talk to each other. The data is inconsistent. The same decision is made three different ways by three different teams. A pilot that looks brilliant in a controlled demo meets an operating environment that was never designed to receive it, and it quietly stalls."],
      ["normal", "This is why buying a more powerful model rarely helps. The limiting factor is not intelligence. It is whether the business has structured its processes and knowledge in a way that automation can act on at all."],
      ["h2", "AI that creates work is not automation"],
      ["normal", "The most common failure mode is subtle: the tool ships, and it adds work. A copilot that needs constant prompting. A dashboard someone has to remember to check. An assistant that requires a human to translate its output into action. If a person has to keep asking the system to keep the work moving, the automation is incomplete. It has moved effort, not removed it."],
      ["h2", "Fix the process before you automate it"],
      ["normal", "The way through is unglamorous. Map the operation end to end before choosing any tool. Separate the work that genuinely needs judgment from the work that only needs consistency. Clean and structure the information so a system can trust it. Only then introduce automation, at the smallest point of the biggest bottleneck, and measure it. Reliability comes from that sequence, not from a better model."],
      ["normal", "AI does not fail because it is not smart enough. It fails because it was layered on top of an organization instead of built into how the organization already works. Fix that order, and the same technology that failed as a pilot starts compounding as an operating system."],
    ],
  },
  {
    _id: "local-shift-tools-to-agent-systems",
    title: "The Shift From Tools to Agent Systems",
    slug: { current: "the-shift-from-tools-to-agent-systems" },
    publishedAt: "2026-07-05T09:00:00.000Z",
    excerpt:
      "The market talks about AI agents as if they were smarter chatbots. They are not. The real shift is from tools you operate to systems that execute, and the difference is the difference between a demo and a result.",
    pairs: [
      ["normal", "Ask ten people what agentic AI is and you will get ten answers, most of them wrong. Search volume for the term has exploded, but the popular mental model is still a chatbot with extra steps. That framing quietly guarantees disappointment, because a tool and a system are not the same category of thing."],
      ["h2", "A tool waits. A system acts"],
      ["normal", "A tool is something you operate. You open it, you prompt it, you copy the result somewhere useful. The intelligence lives in the person driving it. An agent system is different. It observes a trigger, decides what to do, and acts inside your real workflows, without a human standing over it. The value is not the conversation. The value is the execution."],
      ["normal", "This is why the strongest AI agent platforms for business are judged less on how clever they sound and more on what they reliably complete. An agent that drafts a good answer but cannot post it to your ERP, reconcile it, and flag the exception has not automated anything. It has produced content."],
      ["h2", "Plans from AI, execution from code"],
      ["normal", "The reliable pattern is a division of labor. Let the model do what models are good at: interpreting messy input, planning an approach, handling ambiguity. Let deterministic code do what code is good at: executing the same steps the same way, every time, with no hallucinations. AI decides. Software acts. That boundary is what turns an impressive agent into a dependable one."],
      ["h2", "What this means for your business"],
      ["normal", "If you are evaluating AI agents, stop asking how smart the demo feels and start asking what it will finish without supervision, how you will see every decision it made, and what happens when something breaks. The shift from tools to agent systems is real, but only the systems half of it survives contact with production."],
    ],
  },
  {
    _id: "local-reliable-over-powerful",
    title: "Why Reliable AI Matters More Than Powerful AI",
    slug: { current: "why-reliable-ai-matters-more-than-powerful-ai" },
    publishedAt: "2026-07-08T09:00:00.000Z",
    excerpt:
      "In a lab, power wins. In an operation, reliability wins. A system that is right ninety-nine times and unpredictable once is not ninety-nine percent good. It is a system nobody can trust with the work that matters.",
    pairs: [
      ["normal", "Enterprise buyers are trained to ask which model is most powerful. It is the wrong first question. Inside a real operation, the deciding property is not peak capability. It is whether the system does the same correct thing every single time, including at 2am, including on the edge case nobody wrote down."],
      ["h2", "Most operational work does not need intelligence"],
      ["normal", "This is uncomfortable but true. The majority of the work inside a business does not require reasoning. It requires consistency. Routing, validation, scheduling, classification, reconciliation. These are rules, and rules outperform models whenever judgment is not actually involved. Reaching for a large model to do deterministic work is how you introduce variance into a process that needed none."],
      ["h2", "The cost of one wrong action"],
      ["normal", "Powerful and unreliable is a dangerous combination in production. A model that is brilliant most of the time but occasionally confident and wrong forces a human to check everything, which erases the saving that justified the automation. Reliability is what lets you actually remove the human from the loop, because you no longer have to audit the output."],
      ["h2", "Build for the failure, not the demo"],
      ["normal", "Reliable AI automation is designed around what happens when things go wrong. Automated validation. Exception queues. Monitoring that catches the anomaly before your team does, three days late. When the unexpected happens, the system flags it and holds, rather than guessing. That discipline is less impressive in a sales meeting and far more valuable in an operation. Power gets you a demo. Reliability gets you a business that can depend on the thing you built."],
    ],
  },
  {
    _id: "local-ppf-of-organizations",
    title: "The Production Possibility Frontier of Organizations",
    slug: { current: "the-production-possibility-frontier-of-organizations" },
    publishedAt: "2026-07-10T09:00:00.000Z",
    excerpt:
      "Every organization sits on a curve between the work it must do by hand and the outcomes it can produce. Automation does not just make you faster. Done properly, it moves the entire frontier outward.",
    pairs: [
      ["normal", "Borrow one idea from economics. A production possibility frontier is the boundary of what you can produce given your resources. Organizations have one too. On one axis, the manual effort your people can supply. On the other, the outcomes you can deliver. Most companies live well inside their frontier, because so much human capacity is consumed by work that never needed a human at all."],
      ["h2", "Manual work is a tax on capacity"],
      ["normal", "When people spend their day re-keying data between systems, compiling reports, and chasing exceptions, that capacity is gone. It cannot be spent on judgment, relationships, or growth. The organization is not short of talent. It is spending its talent as an integration layer between tools that do not talk to each other."],
      ["h2", "Automation moves the boundary, it does not just shift along it"],
      ["normal", "Buying a faster tool moves you along the existing curve. Redesigning how the work happens moves the curve itself. When you connect systems so data flows on its own, hand repetitive execution to reliable automation, and keep humans for the decisions that genuinely need them, the same headcount can produce materially more. This is why a four-person team, properly instrumented, can run at the capacity of a department."],
      ["h2", "Why this is the real case for an AI automation agency"],
      ["normal", "The point of working with an AI automation partner is not to install software. It is to move your frontier outward and keep it there. That requires understanding the operation first, structuring the information, and building systems that compound. The technology is one input. The expanded capacity of the organization is the actual product."],
    ],
  },
  {
    _id: "local-intelligence-as-opex",
    title: "Intelligence as Operating Expenditure",
    slug: { current: "intelligence-as-operating-expenditure" },
    publishedAt: "2026-07-12T09:00:00.000Z",
    excerpt:
      "For most of history, judgment was a fixed cost tied to headcount. AI changes the accounting. Intelligence is becoming something you can meter, and that changes how you should budget for it.",
    pairs: [
      ["normal", "Think about how organizations have always bought judgment. You hired a person, and their reasoning came bundled with a salary, whether you used it for one hard decision a week or a hundred. Intelligence was a fixed cost, coupled to headcount and difficult to scale up or down. That coupling is now breaking."],
      ["h2", "From fixed cost to metered cost"],
      ["normal", "With AI automation, a unit of reasoning has a price, and you pay for it when you use it. A classification, a summary, a decision. This is intelligence as operating expenditure rather than a fixed line on the org chart. The strategic consequence is large: capabilities that were uneconomical because they required a full-time person can now exist because they cost a few cents per run."],
      ["h2", "Spend it where it earns, not everywhere"],
      ["normal", "Metered intelligence tempts you to apply a model to everything. Resist it. Most operational work should stay deterministic, because rules are cheaper and more reliable than reasoning when judgment is not required. Spend your metered intelligence precisely, on the interpretation and ambiguity that genuinely need it, and let code carry the rest. Good AI automation tools make that boundary explicit and observable, so you can see exactly what each decision costs."],
      ["h2", "Budget for outcomes, not licenses"],
      ["normal", "The right way to buy this is to start from a workflow and a baseline, then measure what changed. Cost per automation, error rate, hours returned. When intelligence is an operating cost you can meter, the question stops being how many seats you need and becomes how much execution you want to buy, and what it returns."],
    ],
  },
  {
    _id: "local-organizations-that-think",
    title: "Designing Organizations That Think",
    slug: { current: "designing-organizations-that-think" },
    publishedAt: "2026-07-14T09:00:00.000Z",
    excerpt:
      "The goal was never digital transformation. It was building an organization that becomes more capable over time, where knowledge compounds instead of walking out the door every evening.",
    pairs: [
      ["normal", "An organization is an information-processing system. Every workflow is a sequence of observations, decisions, and actions. That system exists long before any software does. It lives in the conversations people have, the approvals they make, the judgment they apply, and the exceptions they know how to recognize. The problem is that all of it is stored in people, and people leave."],
      ["h2", "Fit the technology to reality, then improve it"],
      ["normal", "The failure mode of workflow automation is inventing a new way of working simply because a tool can. Adoption dies when the software does not match how the organization actually operates. The discipline is to understand the real system first, mirror it digitally so it feels obvious to the people using it, and only then improve it. When the digital system reflects reality, adoption is natural rather than forced."],
      ["h2", "Make knowledge compound"],
      ["normal", "The most valuable asset in a business is rarely its data. It is the judgment experienced people develop over years. An organization that thinks captures that judgment in its systems, so process logic outlives the team that wrote it. The first implementation is the hardest, because that is where the work is mapped and the knowledge is structured. Every deployment after that is faster, and every improvement benefits the next one. The system compounds."],
      ["h2", "The real deliverable"],
      ["normal", "A consulting engagement that ends with a presentation leaves nothing behind. The knowledge departs with the consultant, and the organization drifts back to where it started. The alternative is to build AI workflow automation into the operating model so that the business is more capable after you leave than before. That is what designing an organization that thinks actually means. Not a transformation you announce, but a capacity that keeps improving on its own."],
    ],
  },
];

export const LOCAL_ARTICLES: LocalArticle[] = RAW.map((a) => ({
  _id: a._id,
  title: a.title,
  slug: a.slug,
  publishedAt: a.publishedAt,
  excerpt: a.excerpt,
  authorName: AUTHOR,
  body: toBody(a.pairs),
}));

export const LOCAL_ARTICLE_SLUGS = LOCAL_ARTICLES.map((a) => a.slug.current);

export function getLocalArticle(slug: string): LocalArticle | undefined {
  return LOCAL_ARTICLES.find((a) => a.slug.current === slug);
}
