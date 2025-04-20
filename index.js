// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import createMemoryStore from "memorystore";
import session from "express-session";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
var MemoryStore = createMemoryStore(session);
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  isAdmin: boolean("is_admin").default(false),
  isPremium: boolean("is_premium").default(false)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isAdmin: true,
  isPremium: true
});
var loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  rating: integer("rating"),
  reviewCount: integer("review_count"),
  category: text("category").notNull(),
  featured: boolean("featured").default(false)
});
var insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true
});
var experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  duration: text("duration").notNull(),
  rating: integer("rating"),
  reviewCount: integer("review_count"),
  category: text("category").notNull(),
  trending: boolean("trending").default(false),
  bookingPercentage: integer("booking_percentage")
});
var insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true
});
var posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow(),
  isPublic: boolean("is_public").default(true),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0)
});
var insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  likeCount: true,
  commentCount: true,
  shareCount: true
});
var comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  likeCount: integer("like_count").default(0)
});
var insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  likeCount: true
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  destinationId: integer("destination_id"),
  experienceId: integer("experience_id"),
  date: timestamp("date").notNull(),
  persons: integer("persons").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  try {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "tourviaHPT-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByUsername(profile.emails[0].value);
            if (!user) {
              user = await storage.createUser({
                username: profile.emails[0].value,
                email: profile.emails[0].value,
                password: randomBytes(32).toString("hex"),
                // Random password for OAuth users
                name: profile.displayName,
                profilePicture: profile.photos?.[0].value
              });
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
    app2.get("/api/auth/google", passport.authenticate("google"));
    app2.get(
      "/api/auth/google/callback",
      passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/auth"
      })
    );
  }
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    console.log("Login attempt:", { username: req.body.username });
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        const dbUser = await storage.getUserByUsername(req.body.username);
        console.log("DB User found:", !!dbUser, "Password match failed");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.login(user, (err2) => {
        if (err2) {
          console.error("Session error:", err2);
          return next(err2);
        }
        const { password, ...safeUser } = user;
        console.log("Login successful for user:", safeUser.username);
        res.status(200).json(safeUser);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/debug/users", async (req, res) => {
    const users2 = await storage.getUsers();
    const safeUsers = users2.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    res.json(safeUsers);
  });
  setupAuth(app2);
  app2.get("/api/destinations", async (req, res) => {
    try {
      const destinations2 = await storage.getDestinations();
      res.json(destinations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });
  app2.get("/api/destinations/featured", async (req, res) => {
    try {
      const featuredDestinations = await storage.getFeaturedDestinations();
      res.json(featuredDestinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured destinations" });
    }
  });
  app2.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });
  app2.get("/api/experiences", async (req, res) => {
    try {
      const experiences2 = await storage.getExperiences();
      res.json(experiences2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });
  app2.get("/api/experiences/trending", async (req, res) => {
    try {
      const trendingExperiences = await storage.getTrendingExperiences();
      res.json(trendingExperiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending experiences" });
    }
  });
  app2.get("/api/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.getExperience(id);
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });
  app2.get("/api/posts", async (req, res) => {
    try {
      const posts2 = await storage.getPosts();
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const validation = insertPostSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      const newPost = await storage.createPost({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  app2.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments2 = await storage.getCommentsByPost(postId);
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/posts/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const postId = parseInt(req.params.id);
      const validation = insertCommentSchema.safeParse({ ...req.body, postId, userId: req.user.id });
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      const newComment = await storage.createComment({
        ...req.body,
        postId,
        userId: req.user.id
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app2.get("/api/users/:id/posts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const posts2 = await storage.getPostsByUser(userId);
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });
  app2.get("/api/users/:id/bookings", async (req, res) => {
    if (!req.isAuthenticated() || req.user.id !== parseInt(req.params.id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const userId = parseInt(req.params.id);
      const bookings2 = await storage.getBookingsByUser(userId);
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const validation = insertBookingSchema.safeParse({
        ...req.body,
        userId: req.user.id
      });
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      const newBooking = await storage.createBooking({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    app2.get("/api/debug/db", (req, res) => {
      const dbState = {
        users: Array.from(storage.users.values()),
        destinations: Array.from(storage.destinations.values()),
        experiences: Array.from(storage.experiences.values()),
        posts: Array.from(storage.posts.values()),
        comments: Array.from(storage.comments.values()),
        bookings: Array.from(storage.bookings.values())
      };
      res.json(dbState);
    });
  }
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
