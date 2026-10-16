export interface DsaProblem {
  id: string
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  acceptanceRate: string
  category:
    | "Arrays"
    | "Strings"
    | "Trees"
    | "Dynamic Programming"
    | "Graphs"
    | "Binary Search"
  tags: string[]
  solved: boolean
  likes: number
}

export const MOCK_DSA_PROBLEMS: DsaProblem[] = [
  {
    id: "p-1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    acceptanceRate: "52.8%",
    category: "Arrays",
    tags: ["Array", "Hash Table"],
    solved: true,
    likes: 54120,
  },
  {
    id: "p-2",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    acceptanceRate: "34.6%",
    category: "Strings",
    tags: ["Hash Table", "Sliding Window", "String"],
    solved: true,
    likes: 38400,
  },
  {
    id: "p-3",
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    acceptanceRate: "39.4%",
    category: "Binary Search",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    solved: false,
    likes: 27900,
  },
  {
    id: "p-4",
    title: "Lowest Common Ancestor in Binary Tree",
    slug: "lowest-common-ancestor",
    difficulty: "Medium",
    acceptanceRate: "61.2%",
    category: "Trees",
    tags: ["Tree", "DFS", "Binary Tree"],
    solved: false,
    likes: 16200,
  },
  {
    id: "p-5",
    title: "Coin Change (Minimum Coins)",
    slug: "coin-change",
    difficulty: "Medium",
    acceptanceRate: "44.1%",
    category: "Dynamic Programming",
    tags: ["Array", "Dynamic Programming", "BFS"],
    solved: false,
    likes: 19850,
  },
  {
    id: "p-6",
    title: "Word Ladder II",
    slug: "word-ladder-ii",
    difficulty: "Hard",
    acceptanceRate: "28.5%",
    category: "Graphs",
    tags: ["Hash Table", "String", "Backtracking", "BFS"],
    solved: false,
    likes: 6200,
  },
]

export interface SqlQueryExercise {
  id: string
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tableContext: string
  category: "Aggregations" | "Joins" | "Window Functions" | "Subqueries"
  solved: boolean
}

export const MOCK_SQL_EXERCISES: SqlQueryExercise[] = [
  {
    id: "sql-1",
    title: "Monthly Active Subscribers & MRR",
    slug: "monthly-active-subscribers",
    difficulty: "Medium",
    tableContext: "subscriptions (id, user_id, amount, status, renewed_at)",
    category: "Window Functions",
    solved: true,
  },
  {
    id: "sql-2",
    title: "Second Highest Employee Salary",
    slug: "second-highest-salary",
    difficulty: "Easy",
    tableContext: "employees (id, name, department_id, salary)",
    category: "Subqueries",
    solved: true,
  },
  {
    id: "sql-3",
    title: "Top 3 Products Sold per Category",
    slug: "top-products-per-category",
    difficulty: "Medium",
    tableContext: "products, order_items, orders",
    category: "Joins",
    solved: false,
  },
  {
    id: "sql-4",
    title: "Cumulative Revenue & Retention Cohorts",
    slug: "cumulative-revenue-cohorts",
    difficulty: "Hard",
    tableContext: "users, transactions, payment_events",
    category: "Window Functions",
    solved: false,
  },
]

export interface DatabaseSchemaModel {
  id: string
  name: string
  tablesCount: number
  dialect: "PostgreSQL" | "MySQL" | "SQLite" | "SQL Server"
  updatedAt: string
  color: string
  tables: {
    name: string
    columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[]
  }[]
}

export const MOCK_DB_SCHEMAS: DatabaseSchemaModel[] = [
  {
    id: "schema-1",
    name: "E-Commerce Core Schema",
    tablesCount: 8,
    dialect: "PostgreSQL",
    updatedAt: "10 mins ago",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "uuid", isPk: true },
          { name: "email", type: "varchar(255)" },
          { name: "role", type: "enum_role" },
          { name: "created_at", type: "timestamptz" },
        ],
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "uuid", isPk: true },
          { name: "user_id", type: "uuid", isFk: true },
          { name: "total_cents", type: "bigint" },
          { name: "status", type: "order_status" },
        ],
      },
      {
        name: "order_items",
        columns: [
          { name: "id", type: "uuid", isPk: true },
          { name: "order_id", type: "uuid", isFk: true },
          { name: "product_id", type: "uuid", isFk: true },
          { name: "quantity", type: "integer" },
        ],
      },
    ],
  },
  {
    id: "schema-2",
    name: "Social Feed & Followers Graph",
    tablesCount: 6,
    dialect: "PostgreSQL",
    updatedAt: "2 hrs ago",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
    tables: [
      {
        name: "posts",
        columns: [
          { name: "id", type: "uuid", isPk: true },
          { name: "author_id", type: "uuid", isFk: true },
          { name: "content", type: "text" },
          { name: "likes_count", type: "integer" },
        ],
      },
      {
        name: "follows",
        columns: [
          { name: "follower_id", type: "uuid", isPk: true, isFk: true },
          { name: "following_id", type: "uuid", isPk: true, isFk: true },
          { name: "created_at", type: "timestamptz" },
        ],
      },
    ],
  },
  {
    id: "schema-3",
    name: "Analytics & Event Tracking Engine",
    tablesCount: 5,
    dialect: "MySQL",
    updatedAt: "Yesterday",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    tables: [
      {
        name: "events",
        columns: [
          { name: "event_id", type: "varchar(64)", isPk: true },
          { name: "session_id", type: "varchar(64)" },
          { name: "event_type", type: "varchar(32)" },
          { name: "payload_json", type: "json" },
        ],
      },
    ],
  },
]

export interface SystemDesignArchitecture {
  id: string
  title: string
  slug: string
  difficulty: "Fundamental" | "Intermediate" | "Advanced"
  readTime: string
  components: string[]
  metrics: { qps: string; latency: string; storage: string }
  category:
    | "Distributed Systems"
    | "Storage & Caching"
    | "Realtime Messaging"
    | "High Availability"
  summary: string
}

export const MOCK_SYSTEM_DESIGNS: SystemDesignArchitecture[] = [
  {
    id: "sys-1",
    title: "Design a Global Rate Limiter",
    slug: "global-rate-limiter",
    difficulty: "Intermediate",
    readTime: "18 min read",
    components: [
      "Redis Cluster",
      "Token Bucket",
      "Envoy Proxy",
      "Bloom Filter",
    ],
    metrics: { qps: "500k req/s", latency: "< 2ms", storage: "128 GB Redis" },
    category: "Distributed Systems",
    summary:
      "Sliding window counter and token bucket algorithms with Redis cluster synchronization and local edge memory caching.",
  },
  {
    id: "sys-2",
    title: "Design an Instant Distributed Chat App (Slack / Discord)",
    slug: "distributed-chat-system",
    difficulty: "Advanced",
    readTime: "26 min read",
    components: [
      "WebSocket Gateways",
      "Apache Kafka",
      "Cassandra",
      "Redis Pub/Sub",
    ],
    metrics: { qps: "1.2M events/s", latency: "< 50ms", storage: "10 PB/year" },
    category: "Realtime Messaging",
    summary:
      "Bidirectional WebSocket connections terminated at regional edge routers with Kafka event bus partition replication.",
  },
  {
    id: "sys-3",
    title: "Design a High-Throughput URL Shortener (Bitly)",
    slug: "url-shortener",
    difficulty: "Fundamental",
    readTime: "12 min read",
    components: [
      "Base62 Encoder",
      "PostgreSQL",
      "Redis Cache",
      "Snowflake ID Generator",
    ],
    metrics: { qps: "100k writes/s", latency: "< 5ms", storage: "15 TB total" },
    category: "Storage & Caching",
    summary:
      "Distributed ID generation using Twitter Snowflake, 7-character Base62 string hashing, and read-heavy 80/20 LRU cache tiering.",
  },
  {
    id: "sys-4",
    title: "Design a Video Streaming Architecture (Netflix / YouTube)",
    slug: "video-streaming-architecture",
    difficulty: "Advanced",
    readTime: "30 min read",
    components: [
      "CDN Tiering",
      "HLS/DASH Transcoders",
      "Blob Storage (S3)",
      "Cassandra Metadata",
    ],
    metrics: {
      qps: "2.5M concurrent streams",
      latency: "< 200ms TTFB",
      storage: "250 PB",
    },
    category: "High Availability",
    summary:
      "Adaptive bitrate video encoding pipeline, multi-CDN traffic steering, and hierarchical chunk chunk caching.",
  },
]
