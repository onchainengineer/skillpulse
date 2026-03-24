export interface DomainConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  subreddits: string[];
  hnTags: string[];
  devtoTags: string[];
  suggestedWeeks: { beginner: number; intermediate: number; advanced: number };
}

export const DOMAINS: DomainConfig[] = [
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: "🤖",
    description: "LLMs, computer vision, NLP, AI tools & frameworks",
    subreddits: ["artificial", "MachineLearning", "LocalLLaMA", "ChatGPT"],
    hnTags: ["ai", "machine-learning", "llm", "gpt", "claude"],
    devtoTags: ["ai", "machinelearning", "llm", "openai"],
    suggestedWeeks: { beginner: 6, intermediate: 4, advanced: 3 },
  },
  {
    id: "web-dev",
    name: "Web Development",
    icon: "🌐",
    description: "React, Next.js, Vue, modern CSS, web APIs",
    subreddits: ["webdev", "reactjs", "nextjs", "frontend"],
    hnTags: ["react", "nextjs", "javascript", "css", "web"],
    devtoTags: ["webdev", "react", "nextjs", "javascript"],
    suggestedWeeks: { beginner: 5, intermediate: 3, advanced: 2 },
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    icon: "☁️",
    description: "AWS, GCP, Azure, Kubernetes, CI/CD, IaC",
    subreddits: ["devops", "kubernetes", "aws", "googlecloud"],
    hnTags: ["kubernetes", "docker", "aws", "cloud", "devops"],
    devtoTags: ["devops", "kubernetes", "aws", "cloud"],
    suggestedWeeks: { beginner: 6, intermediate: 4, advanced: 3 },
  },
  {
    id: "web3-blockchain",
    name: "Web3 & Blockchain",
    icon: "⛓️",
    description: "Smart contracts, DeFi, NFTs, L2s, crypto",
    subreddits: ["ethereum", "solana", "CryptoCurrency", "defi"],
    hnTags: ["blockchain", "ethereum", "web3", "crypto", "solana"],
    devtoTags: ["blockchain", "web3", "solidity", "ethereum"],
    suggestedWeeks: { beginner: 5, intermediate: 4, advanced: 3 },
  },
  {
    id: "mobile-dev",
    name: "Mobile Development",
    icon: "📱",
    description: "React Native, Flutter, Swift, Kotlin, mobile UX",
    subreddits: ["reactnative", "FlutterDev", "iOSProgramming", "androiddev"],
    hnTags: ["react-native", "flutter", "ios", "android", "mobile"],
    devtoTags: ["mobile", "reactnative", "flutter", "android"],
    suggestedWeeks: { beginner: 5, intermediate: 3, advanced: 2 },
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "🔒",
    description: "AppSec, pentesting, threat intel, zero trust",
    subreddits: ["netsec", "cybersecurity", "hacking", "AskNetsec"],
    hnTags: ["security", "cybersecurity", "infosec", "hacking"],
    devtoTags: ["security", "cybersecurity", "hacking"],
    suggestedWeeks: { beginner: 6, intermediate: 4, advanced: 3 },
  },
  {
    id: "data-engineering",
    name: "Data Engineering",
    icon: "📊",
    description: "Pipelines, Spark, dbt, data lakes, analytics",
    subreddits: ["dataengineering", "datascience", "bigdata"],
    hnTags: ["data", "analytics", "spark", "dbt", "data-engineering"],
    devtoTags: ["data", "database", "analytics", "python"],
    suggestedWeeks: { beginner: 5, intermediate: 4, advanced: 3 },
  },
  {
    id: "rust-systems",
    name: "Systems Programming",
    icon: "⚙️",
    description: "Rust, Go, C++, performance, OS internals",
    subreddits: ["rust", "golang", "cpp", "systems"],
    hnTags: ["rust", "go", "systems", "performance", "cpp"],
    devtoTags: ["rust", "go", "cpp", "systems"],
    suggestedWeeks: { beginner: 6, intermediate: 4, advanced: 3 },
  },
];

export function getDomainById(id: string): DomainConfig | undefined {
  return DOMAINS.find((d) => d.id === id);
}
