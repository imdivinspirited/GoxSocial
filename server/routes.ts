import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPostSchema, insertCommentSchema, insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug endpoint to view users
  app.get("/api/debug/users", async (req, res) => {
    const users = await storage.getUsers();
    // Remove sensitive data before sending
    const safeUsers = users.map(user => {
      const {password, ...safeUser} = user;
      return safeUser;
    });
    res.json(safeUsers);
  });

  // Debug endpoint to update a user
  app.put("/api/debug/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body;
      
      // Update the user
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Safely remove password from response
      const { password, ...safeUser } = updatedUser;
      res.status(200).json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Debug endpoint to create an admin user
  app.post("/api/debug/create-admin", async (req, res) => {
    try {
      const { username, password, email, fullName, bio, profileImage } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user first
      const user = await storage.createUser({
        username,
        password,
        email,
        fullName,
        bio,
        profileImage,
      });
      
      // Then update to make admin
      const adminUser = await storage.updateUser(user.id, {
        isAdmin: true,
        isPremium: true
      });
      
      // Safely remove password from response
      const { password: pwd, ...safeUser } = adminUser || user;
      res.status(201).json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });
  
  // Debug endpoint to create a test post
  app.post("/api/debug/create-post", async (req, res) => {
    try {
      const { userId, content, images, isPublic } = req.body;
      
      // Create the post
      const post = await storage.createPost({
        userId,
        content,
        images: images || [],
        isPublic: isPublic !== undefined ? isPublic : true
      });
      
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create test post" });
    }
  });

  // Set up authentication routes
  setupAuth(app);

  // API Routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/featured", async (req, res) => {
    try {
      const featuredDestinations = await storage.getFeaturedDestinations();
      res.json(featuredDestinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
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

  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.get("/api/experiences/trending", async (req, res) => {
    try {
      const trendingExperiences = await storage.getTrendingExperiences();
      res.json(trendingExperiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending experiences" });
    }
  });

  app.get("/api/experiences/:id", async (req, res) => {
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

  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
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
        userId: req.user!.id,
      });

      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const postId = parseInt(req.params.id);
      const validation = insertCommentSchema.safeParse({ ...req.body, postId, userId: req.user!.id });

      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }

      const newComment = await storage.createComment({
        ...req.body,
        postId,
        userId: req.user!.id,
      });

      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.get("/api/users/:id/posts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const posts = await storage.getPostsByUser(userId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  app.get("/api/users/:id/bookings", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.id !== parseInt(req.params.id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = parseInt(req.params.id);
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validation = insertBookingSchema.safeParse({
        ...req.body,
        userId: req.user!.id,
      });

      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }

      const newBooking = await storage.createBooking({
        ...req.body,
        userId: req.user!.id,
      });

      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Debug endpoint - only available in development
  if (process.env.NODE_ENV !== 'production') {
    app.get('/api/debug/db', (req, res) => {
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
    
    // Add promotional posts for testing
    app.get('/api/debug/add-promo-posts', async (req, res) => {
      try {
        // Import the script dynamically
        const { addPromotionalPosts } = require('./add_promo_posts');
        await addPromotionalPosts();
        res.json({ success: true, message: "Promotional posts added successfully" });
      } catch (error) {
        console.error("Failed to add promotional posts:", error);
        res.status(500).json({ success: false, message: "Failed to add promotional posts" });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}