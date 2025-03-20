import { users, destinations, experiences, posts, comments, bookings } from "@shared/schema";
import { 
  User, InsertUser, Destination, InsertDestination, 
  Experience, InsertExperience, Post, InsertPost, 
  Comment, InsertComment, Booking, InsertBooking
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Memory store for session
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Destination methods
  getDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  getFeaturedDestinations(): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Experience methods
  getExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  getTrendingExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  
  // Post methods
  getPosts(): Promise<Post[]>;
  getPostsByUser(userId: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Comment methods
  getCommentsByPost(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Booking methods
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Session store
  sessionStore: session.SessionStore;
}

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export class PostgresStorage implements IStorage {
  private pool: Pool;
  private db: any;
  sessionStore: session.SessionStore;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool);
    
    // Initialize session store with Postgres
    const PostgresStore = require('connect-pg-simple')(session);
    this.sessionStore = new PostgresStore({
      pool: this.pool,
      tableName: 'session'
    });
    
    // Debug current database state
    console.log('Database initialized with:');
    console.log('Users:', Array.from(this.users.values()));
    
    this.userIdCounter = 1;
    this.destinationIdCounter = 1;
    this.experienceIdCounter = 1;
    this.postIdCounter = 1;
    this.commentIdCounter = 1;
    this.bookingIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Seed some initial data
    this.seedData();
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log("Searching for user:", username);
    console.log("Current users:", Array.from(this.users.values()));
    const user = Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    console.log("Found user:", user);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now, 
      isAdmin: false, 
      isPremium: false 
    };
    
    console.log("Creating new user:", user);
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async getFeaturedDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.featured);
  }
  
  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationIdCounter++;
    const newDestination: Destination = { ...destination, id };
    this.destinations.set(id, newDestination);
    return newDestination;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }
  
  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }
  
  async getTrendingExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(exp => exp.trending);
  }
  
  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = this.experienceIdCounter++;
    const newExperience: Experience = { ...experience, id };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async getPostsByUser(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    
    const newPost: Post = {
      ...post,
      id,
      createdAt: now,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0
    };
    
    this.posts.set(id, newPost);
    return newPost;
  }

  // Comment methods
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    
    const newComment: Comment = {
      ...comment,
      id,
      createdAt: now,
      likeCount: 0
    };
    
    this.comments.set(id, newComment);
    
    // Update comment count on post
    const post = await this.getPost(comment.postId);
    if (post) {
      post.commentCount += 1;
      this.posts.set(post.id, post);
    }
    
    return newComment;
  }

  // Booking methods
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: now
    };
    
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  // Seed data for testing
  private seedData() {
    // Seed destinations
    const destinations: InsertDestination[] = [
      {
        name: "Maldives Paradise",
        location: "South Asia",
        description: "Crystal clear waters and white sand beaches make this the perfect tropical getaway.",
        price: 129900, // stored in cents
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 48, // 4.8 out of 5
        reviewCount: 423,
        category: "Beach",
        featured: true
      },
      {
        name: "Swiss Alps",
        location: "Switzerland",
        description: "Stunning mountain views and world-class skiing in the heart of Europe.",
        price: 179900,
        image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 49,
        reviewCount: 512,
        category: "Mountains",
        featured: true
      },
      {
        name: "Tokyo Experience",
        location: "Japan",
        description: "Immerse yourself in the unique blend of traditional culture and futuristic technology.",
        price: 149900,
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 42,
        reviewCount: 349,
        category: "City Break",
        featured: true
      }
    ];
    
    destinations.forEach(dest => this.createDestination(dest));

    // Seed experiences
    const experiences: InsertExperience[] = [
      {
        name: "Cappadocia Hot Air Balloon",
        location: "Turkey",
        description: "Experience the magical landscapes of Cappadocia from above as you float in a hot air balloon at sunrise.",
        price: 17900,
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        duration: "5 hours",
        rating: 49,
        reviewCount: 219,
        category: "Adventure",
        trending: true,
        bookingPercentage: 95
      },
      {
        name: "Authentic Thai Cooking Class",
        location: "Bangkok, Thailand",
        description: "Learn to cook authentic Thai dishes with a local chef. Includes market tour and all ingredients.",
        price: 4900,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        duration: "3 hours",
        rating: 48,
        reviewCount: 183,
        category: "Culture",
        trending: true,
        bookingPercentage: 80
      },
      {
        name: "Great Barrier Reef Diving",
        location: "Cairns, Australia",
        description: "Discover the underwater paradise of the Great Barrier Reef with certified diving instructors.",
        price: 19900,
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        duration: "Full day",
        rating: 47,
        reviewCount: 279,
        category: "Adventure",
        trending: true,
        bookingPercentage: 85
      }
    ];
    
    experiences.forEach(exp => this.createExperience(exp));
  }
}

export const storage = new MemStorage();
